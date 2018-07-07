/*******************************************************************************
FILE: RowParser
PATH: lib/classes/RowParser.js
SUMMARY: Reads a single line from a CSV file and decides what to do with it
            1) handles data streaming process; that is, how to parse and analyze

*******************************************************************************/
"use strict";
var fs = require('fs');
// var readableStream = fs.createReadStream('file.txt');
var csvSplit = require('comma-separated-values');//applies the rfc4180 standard
var Analyzer = require('./Analyzer.js');
var AddOn = require('./AddOns.js');

var RowParser = {

   run : function () {

      let csvArray;
///////////////////////////////////////////////////////////////////
//----- A. Grab a line from the file and transform to an array-----
///////////////////////////////////////////////////////////////////

      //-----IF STREAMING----- parse the incoming data chunks and (where necessary) mend string fragments
      if (this.operation.STREAM){
        // if another CHUNK IS NOT AVAILABLE, and the streaming process is COMPLETE, proceed to
        //    analyze the string stored in memory
        if (this.operation.doneStreaming) {
          //transform string to array/row
          csvArray = new csvSplit(this.operation.stringFrag).parse()[0];
          this.operation.rowData = csvArray;
        }


        // if NO ROW/FRAGMENT STORED in memory, analyze string
        else if (!this.operation.stringFrag
                 && this.operation.chunkRowNum < this.operation.dataChunkLastRow
                 && !this.operation.opEnded)
        {
          //transform string to array/row
          csvArray = new csvSplit(this.operation.dataChunk.toString().split("\n")[this.operation.chunkRowNum]).parse()[0];
          this.operation.rowData = csvArray;
        }

        // if this is the LAST LINE of the Data Chunk, hold (the string fragment or string) in memory (and
        //      postpone analyzing it until it is understood whether another Data Chunk is available
        else if (this.operation.chunkRowNum === this.operation.dataChunkLastRow) {

            this.operation.stringFrag = this.operation.dataChunk.toString().split("\n")[this.operation.chunkRowNum];
            this.operation.rowNum--;//<--rowNum will advance when fragments are later joined, or when streaming process is complete (determined later)
            this.operation.totalRowsParsed--;
            this.operation.skipRow = true;
            this.operation.rowData = [];
            csvArray = [];
        }



        //---turn this off---
        else if (this.operation.opEnded) {
          if (!this.operation.stringFrag) {
            console.log('test1');
            //transform string to array/row
            csvArray = new csvSplit(this.operation.dataChunk.toString().split("\n")[this.operation.chunkRowNum]).parse()[0];
            this.operation.rowData = csvArray;
          } else {
            console.log('test2');
            csvArray = new csvSplit(this.operation.stringFrag + this.operation.dataChunk.toString().split("\n")[this.operation.chunkRowNum]).parse()[0];
            this.operation.rowData = csvArray;
            this.operation.stringFrag = undefined;
          }
        }



        // if another CHUNK IS AVAILABLE, append new string fragment to string fragment in memory then proceed to analyze
        else if (this.operation.chunkRowNum === 0
            && this.operation.stringFrag
        ) {
          //transform string to array/row
          csvArray = new csvSplit(this.operation.stringFrag + this.operation.dataChunk.toString().split("\n")[this.operation.chunkRowNum]).parse()[0];
          this.operation.rowData = csvArray;
          this.operation.stringFrag = undefined;
        }
      }

      //-----IF NOT STREAMING----- wait for the entire file to arrive and process
      else if (!this.operation.STREAM){
        //transform string to array/row
        csvArray = new csvSplit(fs.readFileSync(this.operation.file).toString().split("\n")[this.operation.rowNum]).parse()[0];
        this.operation.rowData = csvArray;
      }

//////////////////////////////////////////////////////////////
//---------- B. Process array grabbed from the file ---------
//////////////////////////////////////////////////////////////

      // keep count of rows and characters processed
      ++this.operation.totalRowsParsed;
      this.operation.totalCharsParsed = csvArray.toString().length + this.operation.totalCharsParsed;

    //------------------IF SET: SELECT ONLY SPECIFIED COLUMNS-------------------------------------------
      if (this.operation.EXCLUDE_COLUMNS) {
        let indexOffset = 0;
        for (let columnIndex = 0; columnIndex < this.operation.EXCLUDE_COLUMNS.length; columnIndex++){
           csvArray.splice((this.operation.EXCLUDE_COLUMNS[columnIndex]-1) - indexOffset,1);
            indexOffset++;
          }
      }

    //------------------IF SET: ADD EXTRA COLUMNS OR HANDLE THEIR DATA OPERATIONS-----------------------

    //if set, add/handle a row number id
      if (this.operation.ROW_NUM) {AddOn.rowNum.call({operation:this.operation,reject:this.reject});}
    //if set, add/handle a unique id
      if (this.operation.UNIQUE_ID) {AddOn.uniqueID.call({operation:this.operation,reject:this.reject});}
    //if set, add/handle a local timestamp
      if (this.operation.TIMESTAMP_LOCAL) {AddOn.timeStampLocal.call({operation:this.operation,reject:this.reject});}
    //if set, add/handle a utc timestamp
      if (this.operation.TIMESTAMP_UTC) {AddOn.timeStampUTC.call({operation:this.operation,reject:this.reject});}

      // if row skipped, forego any further analyzing, else proceed
      if (!this.operation.skipRow){

        //////////////////////////////////// IF A HEADER ROW //////////////////////////////////////

        if (!this.operation.HEADER && this.operation.HEADER_MISSING){
          this.operation.header.columnNames.push('ERROR');//<-- needed to error gracefully
          this.reject('ERROR: HEADER undefined');}
        else if (this.operation.rowNum === 0 && !this.operation.HEADER_MISSING){
          Analyzer.determineHeader.call({operation:this.operation,reject:this.reject});}
        else if (this.operation.rowNum === 0 && this.operation.HEADER_MISSING){
          Analyzer.determineHeader.call({operation:this.operation,reject:this.reject});
          // override rowNum in this circumstance: where the first row in file IS a data row
          // and must be appended to the cache...
          this.operation.rowNum++;
          Analyzer.appendRowToCache.call({operation:this.operation,csvArray:csvArray,reject:this.reject});
          //... the row will still be counted further below
          this.operation.rowNum--;}

        //////////////////////////////////// IF A DATA ROW ///////////////////////////////////////
        else if (this.operation.rowNum > 0 && this.operation.BEGIN_CACHING_AT_ROW === 0 && this.operation.END_PARSE_AT_ROW === 0){/*do nothing*/}

        else if (this.operation.rowNum > 0){

          // determine whether row is to be excluded from analysis
          if (this.operation.EXCLUDE_ROWS){
            // parse/compare against the excluson list
            //----------(!!!!!!USE A DO/WHILE LOOP HERE!!!!!!)--------
            // If a value matches, it's not necessary to proceed any further!
            // The current code is wasting machine resoures here)

            let excludedRowIndex = -1;
            while(this.operation.skipRow = false){

              excludedRowIndex++;
              if(this.operation.EXCLUDE_ROWS[excludedRowIndex] === this.operation.rowNum) {
                console.log(excludedRowIndex)
                this.operation.skipRow = true;
                this.operation.cache.skipped++;
              }

            }

            /*-------------------The old way
            for(let skip = 0; skip < this.operation.EXCLUDE_ROWS.length; skip++){
              if(this.operation.EXCLUDE_ROWS[skip] === this.operation.rowNum) {
                this.operation.skipRow = true;
                this.operation.cache.skipped++;
              }
            }
            //----------------------------*/

          }

          // if row is to be analyzed (that is:
          //  1. the row is NOT:  A. on the exclusion list, or B. exceeding the column limit
          //  2. the cache size has NOT been exceeded)...
          if (!this.operation.skipRow && !this.operation.cache.limitMsg) {
            // AND if cache row filter is set...
            if(this.operation.BEGIN_CACHING_AT_ROW){
              // AND cache row filter is
              if(this.operation.rowNum >= this.operation.BEGIN_CACHING_AT_ROW) {
                Analyzer.appendRowToCache.call({operation:this.operation,csvArray:csvArray,reject:this.reject});
              }
            } else {
              Analyzer.appendRowToCache.call({operation:this.operation,csvArray:csvArray,reject:this.reject});
            }
          }

        }
      }
      this.operation.skipRow = false;
      this.operation.chunkRowNum++;
      this.operation.rowNum++;
  }

}

module.exports = RowParser;

