/*******************************************************************************
FILE: AddOns
PATH: lib/classes/AddOns.js
SUMMARY: appends additonal columns to cached dataset
*******************************************************************************/
"use strict";
var tools = require('../tools/tools.js');

var AddOns = {

    rowNum : function () {
      if (this.operation.rowNum === 0){
        this.operation.rowOffset ++;
        this.operation.rowData.unshift(this.operation.ROW_NUM);
        //add ROW_NUM name to header row
        if (this.operation.HEADER){this.operation.HEADER.unshift(this.operation.ROW_NUM);}
      }else{
        //add ROW_NUM dynamic value to data rows
        this.operation.rowData.unshift(this.operation.totalRowsParsed-1);
      }
    },

    uniqueID : function () {
      if (this.operation.rowNum === 0){
        this.operation.rowOffset ++;
        this.operation.rowData.unshift(this.operation.UNIQUE_ID);
        //add UNIQUE_ID name to header row
        if (this.operation.HEADER){this.operation.HEADER.unshift(this.operation.UNIQUE_ID);}
      }else{
        //add UNIQUE_ID dynamic value to data rows
        this.operation.rowData.unshift(tools.getUniqueID());
      }
    },

    timeStampLocal : function () {
      if (this.operation.rowNum === 0){
        this.operation.rowOffset ++;
        this.operation.rowData.push(this.operation.TIMESTAMP_LOCAL);
        //add TIMESTAMP_LOCAL name to header row
        if (this.operation.HEADER){this.operation.HEADER.push(this.operation.TIMESTAMP_LOCAL);}
      }else{
        //add TIMESTAMP_LOCAL dynamic value to data rows
        this.operation.rowData.push(tools.timeStamp('local'));
      }
    },

    timeStampUTC : function () {
      if (this.operation.rowNum === 0){
        this.operation.rowOffset ++;
        this.operation.rowData.push(this.operation.TIMESTAMP_UTC);
        //add TIMESTAMP_UTC name to header row
        if (this.operation.HEADER){this.operation.HEADER.push(this.operation.TIMESTAMP_UTC);}
      }else{
        //add TIMESTAMP_UTC dynamic value to data rows
        this.operation.rowData.push(tools.timeStamp());
      }
    }

};

module.exports = AddOns;