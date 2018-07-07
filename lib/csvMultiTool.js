/*******************************************************************************
FILE: csvMultiTool
PATH: lib/csvMultiTool.js
SUMMARY: Parses and analyzes a CSV file for the following information:
    1. file size in bytes
    2. row count (not including the header row)
    3. column names (must not be numeric)
    4. column data types (will return "number", "string", "long", or "lob")...
       "long" and "lob" are adjustable (see Threshold Settings below)
    5. column sizes (in bytes)

NOTES: csv-multiTool assumes the first line of the csv file is the header
       row. If however, the file being analyzed is missing a header, one can and
       should be assigned. This will avoid any errors
       with formatting.

       THRESHOLD SETTINGS---
       Adjust the LONG_THRESHOLD or the LOB_THRESHOLD if characters (found
       in the csv file) are more than one byte, and data field size becomes an
       issue. The default settings (of 4000 and 16000 respectively) assume one
       character = one byte (this is not always true with certain characters).
       As a rule of thumb: for 1 byte characters, set LONG_THRESHOLD = 4000 (and
       the LOB_THRESHOLD = 16000). For 2 byte characters set LONG_THRESHOLD <
       4000 (and the LOB_THRESHOLD < 16000). If all characters are 2 byte, set
       LONG_THRESHOLD = 2000 (and the LOB_THRESHOLD = 8000).

*******************************************************************************/
"use strict";
var fs = require('fs');
//var csvSplit = require('comma-separated-values');//applies the rfc4180 standard
// var tools = require('./tools/tools.js');
var Analyzer = require('./classes/Analyzer.js');
var RowParser = require('./classes/RowParser.js');

function csvMultiTool (file, {
  STREAM = true, //--> if "yes" (default), the faster option, reads small chunks into memory and proceeds to analyze data BEFORE reading of file is complete; if "no", the slower option, reads the entire file into memory and then proceeds to process data AFTER reading is complete
  CHUNK_SIZE = 8 * 1024, //--> when streaming, sets the size of the data chunks (in Bytes) to be processed (the default is set at 8k sized chunks)... Smaller chunks means processing of data can begin sooner but with less resources.
  HEADER = undefined, //--> if undefined (default), uses the first line in the CSV file as the header, if defined with an array of values (where array length+1 is equal to the number of columns), overrides existing header (assuming there is one) with a user defined header (see also "HEADER_MISSING" option)
  HEADER_MISSING = false, //--> if "false" (default), assumes the first line in the CSV file to be the Header Row (as opposed to a Data Row); if "true", uses information defined in the HEADER Array as the header, and processes the first line in the CSV file as a Data Row (as opposed to it being the Header Row)
  CACHE_DATASET = undefined, //--> if undefined (default), analyzes only and will not cache any data parsed except what is provded in the returned analysis; if set as "array", "object", or "json" appends a cached dataset to analysis
  CACHE_LIMIT= 50000000, //--> the maximum amount of data that can be cached in memory (default is set to 50Mb)... after the limit has been exceeded, no more rows will be cached

  //-----[FUTURE FEATURE]----- (a tough one... probably needed with giant files, but architectually decisions need to be made with the logistics of this process and how it effects other features... consider not doing this feature in place of already having the control of jumping to AND ending at specific file locations)
  // STREAM_OUT_CHUNKS = false, //--> if "false" (default), outputs analyzed data as a complete dataset (that is, when the parsing/caching is complete data is returned); if "true", outputs analyzed data chunks as when they arrive  (NOTE 1: The STREAM option must be set to "yes") (NOTE 2: when "streaming out chunks"... as some chunks of data will have already been output with different data types, the problem then arises: how to handle the erronous data situation that has occured being that incorrect data types have already been sent/streamed out)

  BEGIN_CACHING_AT_ROW = 1, //--> not excluding the header row... includes the first row of data (if no END_PARSE_AT_ROW is set... will proceed to include every row after until the end is reached)


  //-----[FUTURE FEATURE]----- (NOT POSSIBLE see: http://stackoverflow.com/questions/37817847/node-js-start-reading-a-file-on-a-specific-line)
  // BEGIN_PARSE_AT_ROW= 0 //--> if 0 (default) begins parsing from the very first line of the file; if a number greater than 0, will jump to that physical line number/location within a CSV file, and begin the parsing process at a user defined location within the file as opposed to starting at the top/begining of the file

  END_PARSE_AT_ROW = undefined, //--> the last row to include (if now BEGIN_CACHING_AT_ROW is set... will include all rows except the header until the END_PARSE_AT_ROW is reached)
  EXCLUDE_ROWS = undefined, //--> an array of rows to exclude from loading into cache

  //-----[FUTURE FEATURES]-----
  EXCLUDE_COLUMNS = undefined, //--> if undefined (default), loads all columns (and column data) into cache; if set, will analyze and cache user-defined columns only
  // WHERE_IN = undefined, //--> if undefined (default)), loads rows into cache with no user-defined restriction/filter; if set, chooses rows by specific keywords or phrases (when found in rows) defined in an array of values
  // WHERE_NOT_IN = undefined, //--> if undefined (default)), loads rows into cache with no user-defined restriction/filter; if set, excludes rows by specific keywords or phrases (when found in rows) defined in an array of values


  UNIQUE_ID = undefined, //--> if a value is set, will append a unique id column using the value set as name of the column
  ROW_NUM = undefined, //--> if a value is set, will append a row count column using the value set as name of the column
  TIMESTAMP_UTC = undefined, //--> if a value is set, will append a utc timestamp column using the value set as name of the column
  TIMESTAMP_LOCAL = undefined, //--> if a value is set, will append a local timestamp column using the value set as name of the column
  SNIFFER_ON = 'no', //--> if yes, will return a "dataInQuestion" object with locations (i.e. row & column) for each cell in question
  COLUMN_LIMIT = 100000, //--> the maximum column data size permitted, else a location is returned where the data exceeds the set value
  HEADER_LIMIT = 30, //--> the maximum size a header name is permitted to be

  //-----[DEPRECIATE THESE FEATURES]----- they are not needed as a user can determine (based on column sizes) any further data type resolution
  LONG_THRESHOLD = 4000, //--> the threshold that determines when a string is a "long" data type (as opposed to "string")
  LOB_THRESHOLD = 16000 //--> the threshold that determines when a string is a "lob" data type (as opposed to "long")

  //-----[FUTURE FEATURES]-----
  // DETERMINE_BOOLEAN_TYPES = true //--> if true (default) uses logic to determine boolean data types; if false, forgoes any boolean type determination (values will most likely be determined to be a string or number)
  // BOOLEAN_FORMAT = (set any to character pattern to be used to transform & return a boolean type in any format chosen... e.g. T or F; 1 or 0; yes or no; true or false, a or b...etc) //--> transform/change a boolean convention (from a column that is determined/detected to be boolean)to a user defined boolean convention (e.g. "true" to 1  or  "no" to "false") by setting option with an array of the two desired values (begining with the true/positive value and ending with the negative/false value) (e.g. setting STANDARDIZE_BOOLEAN_TO = ["T","F"] would transform any/all values detected to be true/positive (e.g. 1,"True","+","yes") to "T" and any/all values detected to be false/negative (e.g. 0, -1, "False", "-","no") to "F")
  //   EDGE CASE: how to handle cache after data has been transformed and then sometime later the analyzer determines that the column is not a boolean... how to handle this
  //    SOLUTIONS :
        //  1. Make it not possible to do determine boolean data types when STREAM_OUT_CHUNKS = true ... default to string or number?
        //  2. Throw ERROR and stop (NOTE: how to then handle on the next pass?)
        //  3. Stop transforming and continue analyzing, but without any further transformation making comments in dataInQuestion object
        //  4. Reparse from the beginning noting which column(s) are not boolean (be able to have this process/situation happen more than once (i.e. for more than one column)) (NOTE: when "streaming out chunks"... As some chunks of data will have already been output as "modified" boolean values, the problem then arises: how to handle the erronous data situation that has occured being that incorrect data has alread been sent/streamed out)
        //  5. Cache original values (NOTE: when "streaming out chunks"... As some chunks of data will have already been output as "modified" boolean values, the problem then arises: how to handle the erronous data situation that has occured being that incorrect data has alread been sent/streamed out)
        //  6. Federated aproach: the data chunk (where it was determined that column was not a boolean) will be reprocessed with the correct data type before streaming out the chunk, all prior data chunks released are as is (the state they are in is correct, but not matching the source data in the CSV file), and going foward, will be processed differently resulting in column inconsistantancies between data chunks
    } = {}
  ){

  var operation = {
        file : file,
        STREAM : STREAM,
        CHUNK_SIZE : CHUNK_SIZE,
        HEADER : HEADER,
        HEADER_MISSING : HEADER_MISSING,
        CACHE_DATASET : CACHE_DATASET,
        CACHE_LIMIT : CACHE_LIMIT,
        BEGIN_CACHING_AT_ROW: BEGIN_CACHING_AT_ROW,
        END_PARSE_AT_ROW : END_PARSE_AT_ROW,
        EXCLUDE_ROWS: EXCLUDE_ROWS,
        EXCLUDE_COLUMNS: EXCLUDE_COLUMNS,
        UNIQUE_ID: UNIQUE_ID,
        ROW_NUM : ROW_NUM,
        TIMESTAMP_UTC : TIMESTAMP_UTC,
        TIMESTAMP_LOCAL : TIMESTAMP_LOCAL,
        SNIFFER_ON : SNIFFER_ON,
        COLUMN_LIMIT : COLUMN_LIMIT,
        HEADER_LIMIT : HEADER_LIMIT,
        LONG_THRESHOLD : LONG_THRESHOLD,
        LOB_THRESHOLD : LOB_THRESHOLD,
        rowNum : 0,
        opEnded : false,
        chunkRowNum : 0,
        chunks : 0,
        dataChunkLastRow : 0,
        doneStreaming : false,
        stringFrag:undefined,
        rowData:undefined,
        skipRow:false,
        column:undefined,
        totalCharsParsed : 0,
        totalRowsParsed : 0,
        rowOffset : 0,
        startTmVal : new Date(),
        header : {columnNames:[],
                  columnTypes:[],
                  columnSizes:[]
                },
        cache : {size:0,
                 limit:CACHE_LIMIT,
                 limitMsg:false,
                 skipped:0,
                 rowCount:0,
                 dataset:[]
               },
        dataInQuestion : [],
        dataChunk:''
      };

  return new Promise(function(resolve, reject){



    if (!STREAM){

      if (!END_PARSE_AT_ROW) {
          for (let rowNum = 0; rowNum < fs.readFileSync(operation.file).toString().split("\n").length; rowNum++) {
            RowParser.run.call({operation:operation,reject:reject});
           }

        Analyzer.generateReport.call({operation:operation,resolve:resolve,reject:reject});
        resolve(operation.report);

      }


      if (END_PARSE_AT_ROW) {

        do {
           RowParser.run.call({operation:operation,reject:reject});
        }
        while (operation.rowNum <= operation.END_PARSE_AT_ROW);

        Analyzer.generateReport.call({operation:operation,resolve:resolve,reject:reject});
        resolve(operation.report);
        return;

      }

    }else if (STREAM){
      if (!END_PARSE_AT_ROW) {
        //OPEN A DATA STREAM AND PARSE THE INCOMING DATA CHUNKS
        fs.createReadStream(operation.file, {'highWaterMark' : operation.CHUNK_SIZE})
        .setEncoding('utf8')
        .on('error',function(err){reject(err);})
        .on('data', function(chunk) {
          operation.chunks++;
          operation.chunkRowNum = 0;
          operation.dataChunkLastRow = 0;
          operation.dataChunk = chunk;
          operation.dataChunkLastRow = operation.dataChunk.toString().split("\n").length - 1;
          //feed chunk line by line into the Row Parser
          for (let rowNum = 0; rowNum < operation.dataChunk.toString().split("\n").length; rowNum++) {
            RowParser.run.call({operation:operation,reject:reject});
           }
        })
        .on('end',function(){
          operation.doneStreaming = true;
          RowParser.run.call({operation:operation,reject:reject});
          Analyzer.generateReport.call({operation:operation,resolve:resolve,reject:reject});
          resolve(operation.report);
          return;
        })
      }
      if (END_PARSE_AT_ROW) {
        //OPEN A DATA STREAM AND PARSE THE INCOMING DATA CHUNKS
        fs.createReadStream(operation.file, {'highWaterMark' : operation.CHUNK_SIZE})
        .setEncoding('utf8')
        .on('error',function(err){reject(err);})
        .on('data', function(chunk) {

          operation.chunks++;
          operation.chunkRowNum = 0;
          operation.dataChunkLastRow = 0;
          operation.dataChunk = chunk;
          operation.dataChunkLastRow = operation.dataChunk.toString().split("\n").length - 1;
          while (operation.chunkRowNum <= operation.dataChunkLastRow){
            if (operation.chunkRowNum === operation.dataChunkLastRow){
                   RowParser.run.call({operation:operation,reject:reject});
                 }
            else if (operation.rowNum === operation.END_PARSE_AT_ROW){
                    RowParser.run.call({operation:operation,reject:reject});
                    Analyzer.generateReport.call({operation:operation,resolve:resolve,reject:reject});
                    resolve(operation.report);
                    return;
                  }

            else if(operation.rowNum > operation.END_PARSE_AT_ROW){
              resolve();
              return;
            }
            else if (!operation.opEnded) {
                  RowParser.run.call({operation:operation,reject:reject});}
          }

        })
         .on('end',function(){
           operation.doneStreaming = true;
           RowParser.run.call({operation:operation,reject:reject});
           Analyzer.generateReport.call({operation:operation,resolve:resolve,reject:reject});
           resolve(operation.report);
           return;
         })
      }
    }



  })
}

module.exports = csvMultiTool;
