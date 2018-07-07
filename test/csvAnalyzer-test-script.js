/*****************************************************************
  NAME: csvMultiTool-test-script
  PATH: test/csvMultiTool-test-script.js
  WHAT: Unit tests for "lib/csvMultiTool-test-script.js"
******************************************************************/
"use strict";
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
var csvMultiTool = require('../lib/csvMultiTool.js');

//add a "size" method to the "Object" prototype to get object length
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

describe('The \"csvMultiTool\" function...', function(){





  /*
    it('Test Tester', function (done){
      // let file = './test/csvData/dummy.csv';
      // let file = './test/csvData/lims.csv';
      // let file = './test/csvData/lotsOfData.csv'
      let file = './test/csvData/10000KRowsOfData.csv';
      // let file = './test/csvData/sizeData.csv';
      // let file = './test/csvData/data.csv';
      // let file = './test/csvData/headlessData.csv'
      // let file = './test/csvData/booleanData.csv';
      // let file = './test/csvData/booleanDataError1.csv';
      // let file = './test/csvData/booleanDataError2.csv';

      let options = {
        STREAM       : true,
        CHUNK_SIZE : 8 * 1024,
        // LONG_THRESHOLD       : 4000,
        COLUMN_LIMIT         : 23,
        // HEADER_LIMIT         : 30,
        // LOB_THRSHOLD         : 16000,
        // UNIQUE_ID            : 'unique_id',
         ROW_NUM              : 'rowNumber',
        // TIMESTAMP_LOCAL      : 'analyzed_on',
        // TIMESTAMP_UTC        : 'analyzed_on_utc',
        // HEADER               : ['id_','first','last','age','b_day','desc','msg'],//<--dummy.csv
        // HEADER               : ['id','name','text'],//<--headlessData.csv
        // HEADER_MISSING       : 'false',
        CACHE_DATASET        : 'object',
        // CACHE_LIMIT          : 255,
        // BEGIN_CACHING_AT_ROW : 10799,
        // END_PARSE_AT_ROW     : 10802,
        // EXCLUDE_ROWS         : [5,6,7,8,9],
        // EXCLUDE_COLUMNS      : [3,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
        // EXCLUDE_COLUMNS : [5,6,7,9,10],
        WITH_SQL_SNIFFER     : 'no'
          },
          expectedResult = '';
       this.timeout(20000);
      csvMultiTool(file,options)
        .then(function(res){
        console.log(res);
        console.log(res.cache.dataset);
        done();
      })
      .catch(function(err){
        //console.log(err);
        done(err);
      })

    })
    //*/







//*
  describe('Always does the following as default:',function(){

    it('returns basic report info: filePath, linesParsed, bytesParsed, and secondsElapsed', function (done){
      csvMultiTool('./test/csvData/data.csv')
        .then(function(response){
          response.filePath.should.eql('./test/csvData/data.csv');
          response.filePath.should.be.a('string');
          response.linesParsed.should.eql(2);
          response.linesParsed.should.be.a('number');
          response.bytesParsed.should.eql(54);
          response.bytesParsed.should.be.a('number');
          response.secondsElapsed.should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('returns a table specification', function (done){
      csvMultiTool('./test/csvData/dummy.csv')
        .then(function(response){
          //console.log(response);
          response.tableSpec.should.eql(
             {columnNames: ['ID','FIRST_NAME','LAST_NAME','AGE','BIRTHDAY','DESCRIPTION','MESSAGE'],
              columnTypes: ['number','string','string','number','string','string','string'],
              columnSizes: [ 3, 8, 8, 2, 8, 39, 44 ],
              headerLimit: 30,
              columnLimit: 100000,
              longThreshold: 4000,
              lobThreshold: 16000});
          response.tableSpec.columnNames[4].should.be.a('string');
          response.tableSpec.columnTypes[4].should.be.a('string');
          response.tableSpec.columnSizes[4].should.be.a('number');
          response.tableSpec.columnTypes[4].should.eql('string');
          response.tableSpec.headerLimit.should.be.a('number');
          response.tableSpec.columnLimit.should.be.a('number');
          response.tableSpec.longThreshold.should.be.a('number');
          response.tableSpec.lobThreshold.should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })


    it('can detect a \"string\" data type', function (done){
      csvMultiTool('./test/csvData/data.csv')
        .then(function(response){
          response.tableSpec.columnTypes[2].should.eql('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('can detect a \"number\" data type', function (done){
      csvMultiTool('./test/csvData/data.csv')
        .then(function(response){
          response.tableSpec.columnTypes[0].should.eql('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('can detect a \"boolean\" data type', function (done){
      csvMultiTool('./test/csvData/booleanData.csv')
        .then(function(response){
          response.tableSpec.should.eql(
             {columnNames: [ 'ID', 'NAME','BOOLFIELD', 'TEXT' ],
              columnTypes: [ 'number', 'string', 'boolean', 'string' ],
              columnSizes: [ 1, 12,5,11 ],
              headerLimit: 30,
              columnLimit: 100000,
              longThreshold: 4000,
              lobThreshold: 16000}
            );
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('will resolve \"boolean\" to \"string\" if data does not pertain to boolean inputs types (e.g. yes, No, true, FALSE)', function (done){
      csvMultiTool('./test/csvData/booleanDataError1.csv')
        .then(function(response){
          response.tableSpec.should.eql(
             {columnNames: [ 'ID', 'NAME','BOOLFIELD', 'TEXT' ],
              columnTypes: [ 'number', 'string', 'string', 'string' ],
              columnSizes: [ 1, 12,10,11 ],
              headerLimit: 30,
              columnLimit: 100000,
              longThreshold: 4000,
              lobThreshold: 16000});
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('will resolve \"boolean\" to \"number\" if data does not pertain to boolean inputs types (e.g. 0, 1)', function (done){
      csvMultiTool('./test/csvData/booleanDataError2.csv')
        .then(function(response){
          response.tableSpec.should.eql(
             {columnNames: [ 'ID', 'NAME','BOOLFIELD', 'TEXT' ],
              columnTypes: [ 'number', 'string', 'number', 'string' ],
              columnSizes: [ 1, 12,1,11 ],
              headerLimit: 30,
              columnLimit: 100000,
              longThreshold: 4000,
              lobThreshold: 16000});
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('can detect a \"long\" data type', function (done){
      csvMultiTool('./test/csvData/longData.csv')
        .then(function(response){
          response.tableSpec.columnTypes[1].should.eql('string');
          response.tableSpec.columnTypes[2].should.eql('long');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('can detect a \"lob\" data type', function (done){
      csvMultiTool('./test/csvData/lobData.csv')
        .then(function(response){
          response.tableSpec.columnTypes[1].should.eql('string');
          response.tableSpec.columnTypes[2].should.eql('lob');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    //*
    it('returns an empty dataInQuestion array (when given clean SQL) as default', function (done){
      csvMultiTool('./test/csvData/data.csv')
        .then(function(response){
          response.dataInQuestion.should.eql(false);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })
  })

  describe('Upon adding and configuring specified Options, will:',function(){

    it('return a cached dataset [ARRAY]', function (done){
      let options = { CACHE_DATASET : 'array'},
          expectedResult = {
            rowsCached: 2,
            cacheSize: 54,
            cacheLimit: 50000000,
            rowsSkipped: 0,
            dataset:
             [ [ 1, 'csv-analyzer', 'Here I am' ],
               [ 2, 'data', 'testing 123' ] ] };

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.should.eql(expectedResult);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('return a cached dataset [OBJECT]', function (done){
      let options = { CACHE_DATASET : 'object'},
          expectedResult = {
            rowsCached: 2,
            cacheSize: 92,
            cacheLimit: 50000000,
            rowsSkipped: 0,
            dataset:
             [{
               "ID": 1,
               "NAME": "csv-analyzer",
               "TEXT": "Here I am"
             },
             {
               "ID": 2,
               "NAME": "data",
               "TEXT": "testing 123"
             }] };

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.should.eql(expectedResult);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('return a cached dataset [JSON]', function (done){
      let options = { CACHE_DATASET : 'json'},
          expectedResult = {
            rowsCached: 2,
            cacheSize: 92,
            cacheLimit: 50000000,
            rowsSkipped: 0,
            dataset:'[{\"ID\":1,\"NAME\":\"csv-analyzer\",\"TEXT\":\"Here I am\"},{\"ID\":2,\"NAME\":\"data\",\"TEXT\":\"testing 123\"}]'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.should.eql(expectedResult);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add a row number column', function (done){
      let options = {ROW_NUM : 'rowNumber'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){

          response.tableSpec.should.eql(
          {     columnNames: [ 'ROWNUMBER', 'ID', 'NAME', 'TEXT' ],
                columnTypes: [ 'number', 'number', 'string', 'string' ],
                columnSizes: [ 1, 1, 12, 11 ],
                headerLimit: 30,
                columnLimit: 100000,
                longThreshold: 4000,
                lobThreshold: 16000      });
          response.tableSpec.columnNames[0].should.be.a('string');
          response.tableSpec.columnTypes[0].should.be.a('string');
          response.tableSpec.columnSizes[0].should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add row number data [ARRAY]', function (done){
      let options = {ROW_NUM : 'rowNumber', CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset.should.eql(
          [[ 1, 1, 'csv-analyzer', 'Here I am' ],
             [ 2, 2, 'data', 'testing 123' ] ]
           );
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add row number data [OBJECT]', function (done){
      let options = {ROW_NUM : 'rowNumber', CACHE_DATASET : 'object'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset.should.eql([
            { "ID": 1,
              "NAME": "csv-analyzer",
              "ROWNUMBER": 1,
              "TEXT": "Here I am"
            },
            { "ID": 2,
              "NAME": "data",
              "ROWNUMBER": 2,
              "TEXT": "testing 123"
            }
          ]);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add row number data [JSON]', function (done){
      let options = {ROW_NUM : 'rowNumber', CACHE_DATASET : 'json'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset.should.eql('[{"ROWNUMBER":1,"ID":1,"NAME":"csv-analyzer","TEXT":"Here I am"},{"ROWNUMBER":2,"ID":2,"NAME":"data","TEXT":"testing 123"}]');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add a unique id column', function (done){
      let options = {UNIQUE_ID   : 'unique_id', CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.tableSpec.should.eql(
          {     columnNames: [ 'UNIQUE_ID', 'ID', 'NAME', 'TEXT' ],
                columnTypes: [ 'string', 'number', 'string', 'string' ],
                columnSizes: [ 12, 1, 12, 11 ],
                headerLimit: 30,
                columnLimit: 100000,
                longThreshold: 4000,
                lobThreshold: 16000      });
          response.tableSpec.columnNames[0].should.be.a('string');
          response.tableSpec.columnTypes[0].should.be.a('string');
          response.tableSpec.columnSizes[0].should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add unique id data [ARRAY]', function (done){
      let options = {UNIQUE_ID : 'unique_id', CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset[0].length.should.eql(4);
          response.cache.dataset[0][0].length.should.eql(12);
          response.cache.dataset[0][0].should.be.a('string');
          response.cache.dataset[1].length.should.eql(4);
          response.cache.dataset[1][0].length.should.eql(12);
          response.cache.dataset[1][0].should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add unique id data [OBJECT]', function (done){
      let options = {UNIQUE_ID : 'unique_id', CACHE_DATASET : 'object'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(response.cache.dataset[0]).should.eql(4);
          response.cache.dataset[0].UNIQUE_ID.length.should.eql(12);
          response.cache.dataset[0].UNIQUE_ID.should.be.a('string');
          Object.size(response.cache.dataset[1]).should.eql(4);
          response.cache.dataset[1].UNIQUE_ID.length.should.eql(12);
          response.cache.dataset[1].UNIQUE_ID.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add unique id data [JSON]', function (done){
      let options = {UNIQUE_ID : 'unique_id', CACHE_DATASET : 'json'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(JSON.parse(response.cache.dataset)[0]).should.eql(4);
          JSON.parse(response.cache.dataset)[0].UNIQUE_ID.length.should.eql(12);
          JSON.parse(response.cache.dataset)[0].UNIQUE_ID.should.be.a('string');
          Object.size(JSON.parse(response.cache.dataset)[1]).should.eql(4);
          JSON.parse(response.cache.dataset)[1].UNIQUE_ID.length.should.eql(12);
          JSON.parse(response.cache.dataset)[1].UNIQUE_ID.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add a utc timestamp column', function (done){
      let options = {TIMESTAMP_UTC : 'analyzed_on_utc'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.tableSpec.should.eql(
          {     columnNames: [ 'ID', 'NAME', 'TEXT','ANALYZED_ON_UTC' ],
                columnTypes: [  'number', 'string', 'string','string' ],
                columnSizes: [ 1, 12, 11, 24 ],
                headerLimit: 30,
                columnLimit: 100000,
                longThreshold: 4000,
                lobThreshold: 16000      });
          response.tableSpec.columnNames[3].should.be.a('string');
          response.tableSpec.columnTypes[3].should.be.a('string');
          response.tableSpec.columnSizes[3].should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add utc timestamp data [ARRAY]', function (done){
      let options = {TIMESTAMP_UTC : 'analyzed_on_utc', CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset[0].length.should.eql(4);
          response.cache.dataset[0][3].length.should.eql(24);
          response.cache.dataset[0][3].should.be.a('string');
          response.cache.dataset[1].length.should.eql(4);
          response.cache.dataset[1][3].length.should.eql(24);
          response.cache.dataset[0][3].should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add utc timestamp data [OBJECT]', function (done){
      let options = {TIMESTAMP_UTC : 'analyzed_on_utc', CACHE_DATASET : 'object'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(response.cache.dataset[0]).should.eql(4);
          response.cache.dataset[0].ANALYZED_ON_UTC.length.should.eql(24);
          response.cache.dataset[0].ANALYZED_ON_UTC.should.be.a('string');
          Object.size(response.cache.dataset[1]).should.eql(4);
          response.cache.dataset[1].ANALYZED_ON_UTC.length.should.eql(24);
          response.cache.dataset[1].ANALYZED_ON_UTC.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add utc timestamp data [JSON]', function (done){
      let options = {TIMESTAMP_UTC : 'analyzed_on_utc', CACHE_DATASET : 'json'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(JSON.parse(response.cache.dataset)[0]).should.eql(4);
          JSON.parse(response.cache.dataset)[0].ANALYZED_ON_UTC.length.should.eql(24);
          JSON.parse(response.cache.dataset)[0].ANALYZED_ON_UTC.should.be.a('string');
          Object.size(JSON.parse(response.cache.dataset)[1]).should.eql(4);
          JSON.parse(response.cache.dataset)[1].ANALYZED_ON_UTC.length.should.eql(24);
          JSON.parse(response.cache.dataset)[1].ANALYZED_ON_UTC.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add a local timestamp column', function (done){
      let options = {TIMESTAMP_LOCAL : 'analyzed_on'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.tableSpec.should.eql(
          {     columnNames: [ 'ID', 'NAME', 'TEXT','ANALYZED_ON' ],
                columnTypes: [  'number', 'string', 'string','string' ],
                columnSizes: [ 1, 12, 11, 29 ],
                headerLimit: 30,
                columnLimit: 100000,
                longThreshold: 4000,
                lobThreshold: 16000      });
          response.tableSpec.columnNames[3].should.be.a('string');
          response.tableSpec.columnTypes[3].should.be.a('string');
          response.tableSpec.columnSizes[3].should.be.a('number');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add local timestamp data [ARRAY]', function (done){
      let options = {TIMESTAMP_LOCAL : 'analyzed_on', CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.cache.dataset[0].length.should.eql(4);
          response.cache.dataset[0][3].length.should.eql(29);
          response.cache.dataset[0][3].should.be.a('string');
          response.cache.dataset[1].length.should.eql(4);
          response.cache.dataset[1][3].length.should.eql(29);
          response.cache.dataset[1][3].should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add local timestamp data [OBJECT]', function (done){
      let options = {TIMESTAMP_LOCAL : 'analyzed_on', CACHE_DATASET : 'object'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(response.cache.dataset[0]).should.eql(4);
          response.cache.dataset[0].ANALYZED_ON.length.should.eql(29);
          response.cache.dataset[0].ANALYZED_ON.should.be.a('string');
          Object.size(response.cache.dataset[1]).should.eql(4);
          response.cache.dataset[1].ANALYZED_ON.length.should.eql(29);
          response.cache.dataset[1].ANALYZED_ON.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('add local timestamp data [JSON]', function (done){
      let options = {TIMESTAMP_LOCAL : 'analyzed_on', CACHE_DATASET : 'json'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          Object.size(JSON.parse(response.cache.dataset)[0]).should.eql(4);
          JSON.parse(response.cache.dataset)[0].ANALYZED_ON.length.should.eql(29);
          JSON.parse(response.cache.dataset)[0].ANALYZED_ON.should.be.a('string');
          Object.size(JSON.parse(response.cache.dataset)[1]).should.eql(4);
          JSON.parse(response.cache.dataset)[1].ANALYZED_ON.length.should.eql(29);
          JSON.parse(response.cache.dataset)[1].ANALYZED_ON.should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('forego using the file\'s header and use a user defined header instead', function (done){
      let options = {HEADER : ['row1','row2','row3']};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.filePath.should.eql('./test/csvData/data.csv');
          response.filePath.should.be.a('string');
          response.linesParsed.should.eql(2);
          response.linesParsed.should.be.a('number');
          response.bytesParsed.should.eql(54);
          response.bytesParsed.should.be.a('number');
          response.secondsElapsed.should.be.a('number');
          response.tableSpec.columnNames.should.eql([ 'ROW1', 'ROW2', 'ROW3' ]);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })
    it('apply a user defined header if the file to be read is missing a header row [ARRAY]', function (done){
      let options = {HEADER : ['id','name','text'],
                     HEADER_MISSING : true,
                     CACHE_DATASET : 'array'
                    };

      csvMultiTool('./test/csvData/headlessData.csv',options)
        .then(function(response){
          response.filePath.should.eql('./test/csvData/headlessData.csv');
          response.filePath.should.be.a('string');
          response.linesParsed.should.eql(2);
          response.linesParsed.should.be.a('number');
          response.bytesParsed.should.eql(46);
          response.bytesParsed.should.be.a('number');
          response.secondsElapsed.should.be.a('number');
          response.tableSpec.columnNames.should.eql([ 'ID', 'NAME', 'TEXT' ]);
          response.cache.dataset[0].should.eql(["one","csv-analyzer","Here I am"]);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })


    it('apply a user defined header if the file to be read is missing a header row [OBJECT]', function (done){
      let options = {HEADER : ['id','name','text'],
                     HEADER_MISSING : true,
                     CACHE_DATASET : 'object'
                    };

      csvMultiTool('./test/csvData/headlessData.csv',options)
        .then(function(response){
          response.filePath.should.eql('./test/csvData/headlessData.csv');
          response.filePath.should.be.a('string');
          response.linesParsed.should.eql(2);
          response.linesParsed.should.be.a('number');
          response.bytesParsed.should.eql(46);
          response.bytesParsed.should.be.a('number');
          response.secondsElapsed.should.be.a('number');
          response.tableSpec.columnNames.should.eql([ 'ID', 'NAME', 'TEXT' ]);
          response.cache.dataset[0].should.eql({"ID":"one","NAME":"csv-analyzer","TEXT":"Here I am"});
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('apply a user defined header if the file to be read is missing a header row [JSON]', function (done){
      let options = {HEADER : ['id','name','text'],
                     HEADER_MISSING : true,
                     CACHE_DATASET : 'json'
                    };

      csvMultiTool('./test/csvData/headlessData.csv',options)
        .then(function(response){
          response.filePath.should.eql('./test/csvData/headlessData.csv');
          response.filePath.should.be.a('string');
          response.linesParsed.should.eql(2);
          response.linesParsed.should.be.a('number');
          response.bytesParsed.should.eql(46);
          response.bytesParsed.should.be.a('number');
          response.secondsElapsed.should.be.a('number');
          response.tableSpec.columnNames.should.eql([ 'ID', 'NAME', 'TEXT' ]);
          response.cache.dataset.should.eql('[{"ID":"one","NAME":"csv-analyzer","TEXT":"Here I am"},{"ID":"two","NAME":"data","TEXT":"testing 123"}]');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('throw an error if HEADER_MISSING is true and HEADER is undefined', function (done){
      let options        = {HEADER_MISSING : true},
          expectedResult = 'ERROR: HEADER undefined';

      csvMultiTool('./test/csvData/headlessData.csv',options)
        .catch(function(err){
          if (err === expectedResult){
            err.should.eql(expectedResult);
            done();
          }else{
             done({
               EXPECTED_THIS:expectedResult,
               GOT_THIS_INSTEAD:err
             });
          }
        })
    })

    it('throw an error if the user defined \"HEADER\" length does not match the number of columns present in the CSV file ', function (done){
      let options        = {HEADER : ["id"], HEADER_MISSING : true},
          expectedResult = 'ERROR:The number of user defined header values does not match the number of columns present in the CSV file';

      csvMultiTool('./test/csvData/headlessData.csv',options)
        .catch(function(err){
          if (err === expectedResult){
            err.should.eql(expectedResult);
            done();
          }else if (res){
             done({
               EXPECTED_THIS:expectedResult,
               GOT_THIS_INSTEAD:err
             });
          }
        })
    })



    it('finish parsing at a specific row', function (done){
      let options = {END_PARSE_AT_ROW :2, CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.linesParsed.should.eql(2);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })


    it('handles error when end parse value is greater then the length of the CSV file', function (done){
      let options = {END_PARSE_AT_ROW :3, CACHE_DATASET : 'array'};

      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.linesParsed.should.eql(2);
          done();
        })
        .catch(function(err){
          done(err);
        })

    })


    it('throw an error if a header value exceeds a set size limit', function (done){
      let options = {HEADER_LIMIT : 2},
          expectedResult = 'ERROR: Header length exceeded. Column names must be no longer than 2 characters';
      csvMultiTool('./test/csvData/data.csv',options)
        .catch(function(err){
          if (err === expectedResult){
            err.should.eql(expectedResult);
            done();
          }else{
             done({
               EXPECTED_THIS:expectedResult,
               GOT_THIS_INSTEAD:err
             });
          }
        })
    })

    it('throw an error if a user defined header value exceeds a set size limit', function (done){
      let options = {HEADER :  ['id','name_of_a_field_that_exceeds_the_header_limit','text'], HEADER_LIMIT : 30},
          expectedResult = 'ERROR: Header length exceeded. Column names must be no longer than 30 characters';
      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(res){
          if(res){
            done({
              EXPECTED_THIS:expectedResult,
              GOT_THIS_INSTEAD:err
            });
          }
        })
        .catch(function(err){
          if (err === expectedResult){
            err.should.eql(expectedResult);
            done();
          }else{
             done({
               EXPECTED_THIS:expectedResult,
               GOT_THIS_INSTEAD:err
             });
          }
        })
    })

    it('generate a message informing that a cell has exceeds a set size limit', function (done){
      let options = {COLUMN_LIMIT : 5},
          expectedResult = {
            message: 'Row not cached: The column limit has been exceeded',
            row: 1,
            column: 2,
            byteSize: 12
          };
      csvMultiTool('./test/csvData/data.csv',options)
        .then(function(response){
          response.linesParsed.should.eql(2);
          done();
        })
        .catch(function(err){
          done(err);
        })
    })

    it('manually adjust \"long\" data type threshold', function (done){
      let options = {LONG_THRESHOLD : 3}
      csvMultiTool('./test/csvData/longData.csv', options)
        .then(function(response){
          response.tableSpec.columnTypes[1].should.eql('long');
          response.tableSpec.columnTypes[2].should.eql('long');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('manually adjust \"lob\" data type threshold', function (done){
      let options = {LOB_THRESHOLD : 3}
      csvMultiTool('./test/csvData/lobData.csv', options)
        .then(function(response){
          response.tableSpec.columnTypes[1].should.eql('lob');
          response.tableSpec.columnTypes[2].should.eql('lob');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('exclude specific rows from being analyzed and cached', function (done){
      let options = {
        ROW_NUM : 'rownum',
        CACHE_DATASET : 'array',
        EXCLUDE_ROWS : [1,3,4,5,6,7]
      };

      csvMultiTool('./test/csvData/dummy.csv', options)
        .then(function(response){
          //console.log(response);
          response.tableSpec.columnSizes.should.eql([1,3,4,5,2,8,10,21]);
          response.tableSpec.columnTypes.should.eql(['number','number','string','string','number','number','string','string']);
          response.cache.should.eql({
              rowsCached  : 1,
              cacheSize   : 71,
              cacheLimit  : 50000000,
              rowsSkipped : 6,
              dataset     : [[ 2,
                              124,
                              'John',
                              'Smith',
                              62,
                              19540302,
                              'loves data',
                              'csvs are hard to read' ]]
              }
          )
          done();
        })
        .catch(function(err){
          done(err);
        })

    })

    it('returns a dataInQuestion array containing location references to data with know SQL patterns', function (done){
      let options = {
        WITH_SQL_SNIFFER : 'yes'
      };

      csvMultiTool('./test/csvData/snifferData.csv', options)
        .then(function(response){
          //console.log(response);
          response.dataInQuestion.should.eql([
            {
              "column": 3,
              "row": 2,
              "file": "./test/csvData/snifferData.csv",
              "message": "SQL pattern detected",
              "pattern": ";DROP TABLE"
            },
            {
              "column": 2,
              "row": 4,
              "file": "./test/csvData/snifferData.csv",
              "message": "SQL pattern detected",
              "pattern": "'/* create table"
            },
            {
              "column": 3,
              "row": 4,
              "file": "./test/csvData/snifferData.csv",
              "message": "SQL pattern detected",
              "pattern": ";drop table"
            }
          ]);
          response.dataInQuestion[0]['column'].should.be.a('number');
          response.dataInQuestion[0]['row'].should.be.a('number');
          response.dataInQuestion[0]['file'].should.be.a('string');
          response.dataInQuestion[0]['message'].should.be.a('string');
          response.dataInQuestion[0]['pattern'].should.be.a('string');
          done();
        })
        .catch(function(err){
          done(err);
        })

    })


  })




//*/


  })

  /*/
  it('?', function (done){
    let expectedResult = '?';
    tools.readCSVFile('./test/testFiles/dummy.csv')
    .then(function(res){
      console.log(res);
      done();
    })
    .catch(function(err){
      console.log(err);
      done();
    })
  })
})
  //*/

