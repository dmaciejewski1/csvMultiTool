/*******************************************************************************
FILE: Analyzer
PATH: lib/classes/Analyzer.js
SUMMARY: CSV tools that either extract values or provide data functionality
*******************************************************************************/
"use strict";
var Cache = require('./Cache.js');
var Analyzer = require('./Analyzer');
var Sniffer = require('sql-sniffer');
var tools = require('../tools/tools.js');

var Analyzer = {
// change to determineColumnTypes
  determineDataTypes : function () {
    // console.log(this.operation.rowNum+' --- '+this.operation.chunkRowNum+' --- '+this.operation.column+' --- '+this.operation.header.columnTypes[this.operation.column] +' --- '+ this.operation.rowData[this.operation.column]);
    if (this.operation.skipRow === false)
    {if (this.operation.rowNum >= this.operation.BEGIN_CACHING_AT_ROW
        && (isNaN(this.operation.rowData[this.operation.column]) ? this.operation.rowData[this.operation.column].length <= this.operation.COLUMN_LIMIT : this.operation.rowData[this.operation.column].toString().length <= this.operation.COLUMN_LIMIT)
        && !this.operation.skipRow) {
      //if the data type has not yet been determined... determine
      if (this.operation.header.columnTypes[this.operation.column] === null) {
        if(
          //recognized positive boolean values
          this.operation.rowData[this.operation.column] === 'true'
          ||this.operation.rowData[this.operation.column] === 'TRUE'
          ||this.operation.rowData[this.operation.column] === 'True'
          ||this.operation.rowData[this.operation.column] === 'T'
          ||this.operation.rowData[this.operation.column] === 't'
          ||this.operation.rowData[this.operation.column] === true
          ||this.operation.rowData[this.operation.column] === 'yes'
          ||this.operation.rowData[this.operation.column] === 'YES'
          ||this.operation.rowData[this.operation.column] === 'Yes'
          ||this.operation.rowData[this.operation.column] === 'Y'
          ||this.operation.rowData[this.operation.column] === 'y'
          ||this.operation.rowData[this.operation.column] === 'Positive'
          ||this.operation.rowData[this.operation.column] === 'POSITIVE'
          ||this.operation.rowData[this.operation.column] === 'positive'
          ||this.operation.rowData[this.operation.column] === 'Pos'
          ||this.operation.rowData[this.operation.column] === 'POS'
          ||this.operation.rowData[this.operation.column] === 'pos'
          ||this.operation.rowData[this.operation.column] === 'P'
          ||this.operation.rowData[this.operation.column] === 'p'
          ||this.operation.rowData[this.operation.column] === '+'
          ||this.operation.rowData[this.operation.column] === '1'
          ||this.operation.rowData[this.operation.column] === 1

          //recognized negative boolean values
          ||this.operation.rowData[this.operation.column] === 'false'
          ||this.operation.rowData[this.operation.column] === 'FALSE'
          ||this.operation.rowData[this.operation.column] === 'False'
          ||this.operation.rowData[this.operation.column] === 'F'
          ||this.operation.rowData[this.operation.column] === 'f'
          ||this.operation.rowData[this.operation.column] === false
          ||this.operation.rowData[this.operation.column] === 'no'
          ||this.operation.rowData[this.operation.column] === 'NO'
          ||this.operation.rowData[this.operation.column] === 'No'
          ||this.operation.rowData[this.operation.column] === 'N'
          ||this.operation.rowData[this.operation.column] === 'n'
          ||this.operation.rowData[this.operation.column] === 'Negative'
          ||this.operation.rowData[this.operation.column] === 'NEGATIVE'
          ||this.operation.rowData[this.operation.column] === 'negative'
          ||this.operation.rowData[this.operation.column] === 'Neg'
          ||this.operation.rowData[this.operation.column] === 'NEG'
          ||this.operation.rowData[this.operation.column] === 'neg'
          ||this.operation.rowData[this.operation.column] === '-'
          ||this.operation.rowData[this.operation.column] === '0'
          ||this.operation.rowData[this.operation.column] === 0
          ||this.operation.rowData[this.operation.column] === '-1'
          ||this.operation.rowData[this.operation.column] === -1

          //recognized blank boolean values
          ||this.operation.rowData[this.operation.column] === ''
          ||this.operation.rowData[this.operation.column] === null

          ){this.operation.header.columnTypes[this.operation.column] = 'boolean';}
        //if number...
        else if (isNaN(this.operation.rowData[this.operation.column]) === false) {this.operation.header.columnTypes[this.operation.column] = 'number';}
        //if string... find appropriate size
        else if (isNaN(this.operation.rowData[this.operation.column]) === true && this.operation.rowData[this.operation.column].toString().length <= this.operation.LONG_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'string';}
        else if (isNaN(this.operation.rowData[this.operation.column]) === true && this.operation.rowData[this.operation.column].toString().length > this.operation.LONG_THRESHOLD && this.operation.rowData[this.operation.column].toString().length <= this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'long';}
        else if (isNaN(this.operation.rowData[this.operation.column]) === true && this.operation.rowData[this.operation.column].toString().length > this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'lob';}
      }
      //else if larger sized data types determined default to the larger sized data type
      else if (this.operation.header.columnTypes[this.operation.column] === 'boolean'
                    && (
                        //recognized positive boolean values
                        this.operation.rowData[this.operation.column] === 'true'
                        ||this.operation.rowData[this.operation.column] === 'TRUE'
                        ||this.operation.rowData[this.operation.column] === 'True'
                        ||this.operation.rowData[this.operation.column] === 'T'
                        ||this.operation.rowData[this.operation.column] === 't'
                        ||this.operation.rowData[this.operation.column] === true
                        ||this.operation.rowData[this.operation.column] === 'yes'
                        ||this.operation.rowData[this.operation.column] === 'YES'
                        ||this.operation.rowData[this.operation.column] === 'Yes'
                        ||this.operation.rowData[this.operation.column] === 'Y'
                        ||this.operation.rowData[this.operation.column] === 'y'
                        ||this.operation.rowData[this.operation.column] === 'Positive'
                        ||this.operation.rowData[this.operation.column] === 'POSITIVE'
                        ||this.operation.rowData[this.operation.column] === 'positive'
                        ||this.operation.rowData[this.operation.column] === 'Pos'
                        ||this.operation.rowData[this.operation.column] === 'POS'
                        ||this.operation.rowData[this.operation.column] === 'pos'
                        ||this.operation.rowData[this.operation.column] === 'P'
                        ||this.operation.rowData[this.operation.column] === 'p'
                        ||this.operation.rowData[this.operation.column] === '+'
                        ||this.operation.rowData[this.operation.column] === '1'
                        ||this.operation.rowData[this.operation.column] === 1

                        //recognized negative boolean values
                        ||this.operation.rowData[this.operation.column] === 'false'
                        ||this.operation.rowData[this.operation.column] === 'FALSE'
                        ||this.operation.rowData[this.operation.column] === 'False'
                        ||this.operation.rowData[this.operation.column] === 'F'
                        ||this.operation.rowData[this.operation.column] === 'f'
                        ||this.operation.rowData[this.operation.column] === false
                        ||this.operation.rowData[this.operation.column] === 'no'
                        ||this.operation.rowData[this.operation.column] === 'NO'
                        ||this.operation.rowData[this.operation.column] === 'No'
                        ||this.operation.rowData[this.operation.column] === 'N'
                        ||this.operation.rowData[this.operation.column] === 'n'
                        ||this.operation.rowData[this.operation.column] === 'Negative'
                        ||this.operation.rowData[this.operation.column] === 'NEGATIVE'
                        ||this.operation.rowData[this.operation.column] === 'negative'
                        ||this.operation.rowData[this.operation.column] === 'Neg'
                        ||this.operation.rowData[this.operation.column] === 'NEG'
                        ||this.operation.rowData[this.operation.column] === 'neg'
                        ||this.operation.rowData[this.operation.column] === '-'
                        ||this.operation.rowData[this.operation.column] === '0'
                        ||this.operation.rowData[this.operation.column] === 0
                        ||this.operation.rowData[this.operation.column] === '-1'
                        ||this.operation.rowData[this.operation.column] === -1

                        //recognized blank boolean values
                        ||this.operation.rowData[this.operation.column] === ''
                        ||this.operation.rowData[this.operation.column] === null

                       )
                ){
          this.operation.header.columnTypes[this.operation.column] = 'boolean';
      }
      else if (this.operation.header.columnTypes[this.operation.column] === 'boolean'
                && (this.operation.rowData[this.operation.column] >1
                || this.operation.rowData[this.operation.column] <0)
              ){this.operation.header.columnTypes[this.operation.column] = 'number';}
      else if (this.operation.header.columnTypes[this.operation.column] === 'boolean'
                    && (this.operation.rowData[this.operation.column] !== 'true'
                        || this.operation.rowData[this.operation.column] !== 'false'
                       )
              ){this.operation.header.columnTypes[this.operation.column] = 'string';}
      else if (this.operation.header.columnTypes[this.operation.column] === 'string' && this.operation.rowData[this.operation.column].toString().length > this.operation.LONG_THRESHOLD && this.operation.rowData[this.operation.column].toString().length <= this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'long';}
      else if (this.operation.header.columnTypes[this.operation.column] === 'string' && this.operation.rowData[this.operation.column].toString().length > this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'lob';}
      else if (this.operation.header.columnTypes[this.operation.column] === 'long' && this.operation.rowData[this.operation.column].toString().length > this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'lob';}
      //else if data type has already been determined to be a number, and a string is then detected, default to string insted of number
      else if (this.operation.header.columnTypes[this.operation.column] === 'number' && isNaN(this.operation.rowData[this.operation.column])===true) {
        //if string... find appropriate size
        if (this.operation.rowData[this.operation.column].toString().length <= this.operation.LONG_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'string';}
        else if (this.operation.rowData[this.operation.column].toString().length > this.operation.LONG_THRESHOLD && this.operation.rowData[this.operation.column].toString().length <= this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.operation.column] = 'long';}
        else if (this.operation.rowData[this.operation.column].toString().length > this.operation.LOB_THRESHOLD) {this.operation.header.columnTypes[this.column] = 'lob';}
      }
    }
  }},

  determineColumnSizes : function () {
  if (this.operation.skipRow === false)
    {if (this.operation.rowNum >= this.operation.BEGIN_CACHING_AT_ROW
        && (isNaN(this.operation.rowData[this.operation.column]) ? this.operation.rowData[this.operation.column].length <= this.operation.COLUMN_LIMIT : this.operation.rowData[this.operation.column].toString().length <= this.operation.COLUMN_LIMIT)
        && !this.operation.skipRow
      ) {
      //if the column size has not yet been determined... determine
      if (this.operation.header.columnSizes[this.operation.column] === null){
        this.operation.header.columnSizes[this.operation.column] = this.operation.rowData[this.operation.column].toString().length;
      }
      //else if determined size is smaller than current size, overrite with current size
      else if (this.operation.header.columnSizes[this.operation.column] < this.operation.rowData[this.operation.column].toString().length){
        this.operation.header.columnSizes[this.operation.column] = this.operation.rowData[this.operation.column].toString().length;
      }
    }
  }},
// change to determineColumnNames
  determineHeader : function () {
    if (!this.operation.HEADER){
      //parse current row columns
      for (let column = 0; column < this.operation.rowData.length;column++){
        if (this.operation.rowData[column].length > this.operation.HEADER_LIMIT) {this.reject('ERROR: Header length exceeded. Column names must be no longer than '+this.operation.HEADER_LIMIT+' characters');
        }else{
          //push this.operation.header.columnNames names into this.operation.header.columnNames array
          this.operation.header.columnNames.push(this.operation.rowData[column].toUpperCase());// <---ADD REJECT HERE if this.operation.columnNames column is numeric
          //pre-populate both the this.operation.header.columnTypes and columnnSizes array with a null value place holder
          this.operation.header.columnTypes.push(null);
          this.operation.header.columnSizes.push(null);
        }
      }}
    else if (this.operation.HEADER) {
      //parse user defined header
      for (let column = 0; column < this.operation.HEADER.length;column++){
        if (this.operation.HEADER[column].length > this.operation.HEADER_LIMIT) {
          this.reject('ERROR: Header length exceeded. Column names must be no longer than '+this.operation.HEADER_LIMIT+' characters');
        }else if (this.operation.HEADER.length !== this.operation.rowData.length){
          this.operation.header.columnNames.push('ERROR');
          this.reject('ERROR:The number of user defined header values does not match the number of columns present in the CSV file');
        }else{
          this.operation.header.columnNames.push(this.operation.HEADER[column].toUpperCase());
          //pre-populate both the operation.columnTypes and columnnSizes array with a null value place holder
          this.operation.header.columnTypes.push(null);
          this.operation.header.columnSizes.push(null);
        }
      }}
  },

  runSniffer : function () {
    if (isNaN(this.operation.rowData[this.operation.column])){
      let pattern = Sniffer(this.operation.rowData[this.operation.column]);
      if (Sniffer(this.operation.rowData[this.operation.column])){
        if(!this.operation.EXCLUDE_ROWS) {
          this.operation.skipRow = true;
          this.operation.dataInQuestion.push({
            message: 'pattern detected',
            file: this.operation.file,
            row : this.operation.rowNum,
            column : (this.operation.column - this.operation.rowOffset) + (this.operation.rowOffset ? 2 : 1),
            pattern : pattern.toString()
          });
        }else{
          //parse exclusion array
          let rowExcluded = false;
          for(let _rowNum = 0; _rowNum < this.operation.EXCLUDE_ROWS.length ; _rowNum++){
            if(this.operation.EXCLUDE_ROWS[_rowNum] === this.operation.rowNum) {
              rowExcluded = true;
            }
          }
          if (!rowExcluded) {
            this.operation.skipRow = true;
            this.operation.dataInQuestion.push({
              message: 'pattern detected',
              file: this.operation.file,
              row : this.operation.rowNum,
              column : (this.operation.column - this.operation.rowOffset) + (this.operation.rowOffset ? 2 : 1),
              pattern : pattern.toString()
            });
          }
        }
      }
    }
  },

  generateReport : function () {

    this.analysis ={
      "filePath" : this.operation.file,
      "linesParsed" : this.operation.HEADER_MISSING ? this.operation.totalRowsParsed : this.operation.totalRowsParsed-1,
      "bytesParsed" : this.operation.totalCharsParsed,
      "secondsElapsed" : (new Date() - this.operation.startTmVal)/1000
      //,"header" : this.operation.HEADER_MISSING ? "missing/user-defined" : (this.operation.HEADER ? "user-defined" : "defined in file")
    };

    this.streamingInfo = {
      'chunksParsed' : this.operation.chunks,
      'chunkByteCapacity' : this.operation.CHUNK_SIZE
    };

    this.tableSpec = {// <--- CHANGE TO this.columnSpecfication
      "columnNames" : this.operation.header.columnNames, //<--- CHANGE TO names
      "columnTypes" : this.operation.header.columnTypes, //<--- CHANGE TO dataTypes
      "columnSizes" : this.operation.header.columnSizes, //<--- CHANGE TO maxCharacters
      "headerLimit" : this.operation.HEADER_LIMIT, //<--- CHANGE TO nameByteLimit
      "columnLimit" : this.operation.COLUMN_LIMIT, //<--- MOVE TO this.cacheMem object as it apply only when caching rows and change name to dataByteLimit
      "longThreshold" : this.operation.LONG_THRESHOLD,
      "lobThreshold" : this.operation.LOB_THRESHOLD
    };

    this.cacheMem = {
      "rowsCached" : this.operation.cache.rowCount,
      "cacheSize" : this.operation.cache.size,
      "cacheLimit" : this.operation.cache.limit,
      "rowsSkipped" : this.operation.cache.skipped,
      "dataset" : this.operation.cache.dataset.length == 0 ? false : (this.operation.CACHE_DATASET == 'json' ? JSON.stringify(this.operation.cache.dataset) : this.operation.cache.dataset)
    };

    if (!this.operation.STREAM){
      Object.assign(this.analysis,{
        tableSpec : this.tableSpec
      });
    } else if (this.operation.STREAM) {
      Object.assign(this.analysis,{
        readStream : this.streamingInfo,
        tableSpec : this.tableSpec
      });
    }

    if (this.operation.CACHE_DATASET){
      Object.assign(this.analysis,{
        cache : this.cacheMem,
        dataInQuestion: this.operation.dataInQuestion.length == 0 ? false : this.operation.dataInQuestion
      });
      this.resolve(this.analysis);
    }else{
      Object.assign(this.analysis,{
        dataInQuestion: this.operation.dataInQuestion.length == 0 ? false : this.operation.dataInQuestion
      });
      this.resolve(this.analysis);
    }
  },

  // change to determineDataRow
  appendRowToCache : function () {

    // A. ----PARSE EACH ROW'S CELLS AND ANALYZE----
        for (let column = 0; column < this.operation.header.columnNames.length; column++){

        //set column index info within the operation object
          this.operation.column = column;
        // if set to run Sniffer...

          if(this.operation.SNIFFER_ON === 'yes'){Analyzer.runSniffer.call({operation:this.operation,reject:this.reject});}
        // 1. ----DETERMINE AND UPDATE DATA TYPE----
          Analyzer.determineDataTypes.call({operation:this.operation,reject:this.reject});

        // 2. ----DETERMINE AND UPDATE THE COLUMN SIZE----
          Analyzer.determineColumnSizes.call({operation:this.operation,reject:this.reject});

        }

    // B. -----DETERMINE CACHING FORMAT AND APPEND ROW TO CACHE-----

      // I. ----IF ARRAY----
        if (this.operation.CACHE_DATASET === 'array') {

        // 1. ----APPEND ROW AS AN ARRAY TO CACHE----
          Cache.append.call({operation:this.operation,reject:this.reject});

        }

        // II. ----IF OBJECT OR JSON----
        if(this.operation.CACHE_DATASET === 'object' ||
           this.operation.CACHE_DATASET === 'json') {


        // 1. ----TRANSFORM TO OBJECT----
          let rowDataObject = {};
          for (let column = 0; column < this.operation.header.columnNames.length; column++){
            rowDataObject[this.operation.header.columnNames[column]]=this.csvArray[column];
          }
        //apply "object" format to rowData
          this.operation.rowData = rowDataObject;

        // 2. ----APPEND ROW AS AN OBJECT TO CACHE----
          Cache.append.call({operation:this.operation,reject:this.reject});

        //restore rowData to "array" format
          this.operation.rowData = this.csvArray;
        }
  }

};

module.exports = Analyzer;
