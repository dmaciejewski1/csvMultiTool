/*******************************************************************************
FILE: Cache
PATH: lib/classes/Cache.js
SUMMARY: CSV tools that either extract values or provide data functionality
*******************************************************************************/
"use strict";

var Cache = {
  append : function () {
    let msg = function(){
      this.operation.dataInQuestion.push({
        message: this.msg,
        file: this.operation.file,
        row : this.operation.rowNum,
        column : this.operation.column
      });
    };

  /*------------ Overall "Cache.append" logic (in layman's terms)... -------------
      Method checks to see...
       1. if the new row to be appended will exceed the cache limit:
           a. if so: don't cache
           b. if not: proceed to condition 2
       2. if the operation's MISSING_HEADER option is set:
           a. if so: BEGIN_ROW_CACHING (with row offset of -1) must be greater than or equal to this.operation.rowNum
             i. if so : proceed to condition 3
             ii. if not: don't cache
           b. if not: BEGIN_ROW_CACHING must be greater than or equal to then this.operation.rowNum
             i. if so : proceed to condition 3
             ii. if not: don't cache
       3. which format to use for CACHE_DATASET
           a. if "array", the value returned (by the specific logic for talling column size from an array) must not exceed the COLUMN_LIMIT
              i. if so : proceed to condition 4
              ii. if not : don't cache
           b. else the value returned (by the specific logic for talling column size from an object or JSON) must not exceed the COLUMN_LIMIT
              i. if so : proceed to condition 4
              ii. if not : don't cache
       4. if the EXCLUDE_ROWS option is set:  NOTE--> --MOVE EXCLUDE_ROWS LOGIC TO ROW PARSER!!!!!  Add WHERE_IN LOGIC IN ITS PLACE <--NOTE
           a. if so: parse exclusion array
              i. if this.operation.rowNum equals the current row number, DO NOT append row to cache
              ii. if this.operation.rowNum does not equals the current row number, append row to cache
           b. if not: apend row to cache
  -----------------------------------------------------------------------------/*/

    if ((this.operation.cache.size + JSON.stringify(this.operation.rowData).length) <= this.operation.CACHE_LIMIT
       && (!this.operation.MISSING_HEADER ? this.operation.rowNum >=this.operation.BEGIN_CACHING_AT_ROW :this.operation.rowNum >= (this.operation.BEGIN_CACHING_AT_ROW - 1))
       && (isNaN(this.operation.rowData[this.operation.column])
              ? (this.operation.CACHE_DATASET === 'array'
                  ? this.operation.rowData[this.operation.column].length
                  : this.operation.rowData[this.operation.header.columnNames[this.operation.column]].length
                )
                <= this.operation.COLUMN_LIMIT
              : this.operation.rowData[this.operation.column].toString().length
            <= this.operation.COLUMN_LIMIT
          )
        && !this.operation.skipRow
        && !this.operation.limitMsg //<--- when found to be true, means the cache limit has been exceeded, therefore
      ) {
      if(!this.operation.EXCLUDE_ROWS) {


//--------->  add WHERE_IN logic here...
        //check cache size
        this.operation.cache.dataset.push(this.operation.rowData);
        this.operation.cache.rowCount++;
        this.operation.cache.size = JSON.stringify(this.operation.rowData).length + this.operation.cache.size
        // console.log(this.operation.rowData);

      }else{
        //cache check size
        //parse exclusion array
        let rowExcluded = false;
        for(let _rowNum = 0; _rowNum < this.operation.EXCLUDE_ROWS.length ; _rowNum++){
          if(this.operation.EXCLUDE_ROWS[_rowNum] === this.operation.rowNum) {
            rowExcluded = true;
          }
        }
        if (!rowExcluded) {

//--------->  add WHERE_IN logic here...
          this.operation.cache.dataset.push(this.operation.rowData);
          this.operation.cache.rowCount++;
          this.operation.cache.size = JSON.stringify(this.operation.rowData).length + this.operation.cache.size


        }else{/* do nothing */}
      }
    }else{

      this.operation.cache.skipped++;
      if ((this.operation.cache.size + JSON.stringify(this.operation.rowData).length) > this.operation.CACHE_LIMIT) {
        if (!this.operation.cache.limitMsg){ //<-- send only once
          this.operation.cache.limitMsg = true; //<--when set to true, message will no longer be appended to the dataInQuestion object AND will prevent any further analysis from occuring (going forward)
          msg.call({operation:this.operation,msg:'The cache limit has been exceeded: No more rows will be appended to cache'});
        }
      }

      else if ((this.operation.CACHE_DATASET === 'array'
          ? this.operation.rowData[this.operation.column].length
          : this.operation.rowData[this.operation.header.columnNames[this.operation.column]].length
        ) > this.operation.COLUMN_LIMIT ) {
        msg.call({operation:this.operation,msg:'Row not cached: The column limit has been exceeded'});
      }
    }
  }
};

module.exports = Cache;