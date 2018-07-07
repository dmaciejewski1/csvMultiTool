

# csvMultiTool
Create a data stream from a CSV file to simultaneously analyze, filter, format,
and cache information.

### Summary
In a single (or partial) file scan, stream through a CSV file to determine it's table
specifications (i.e. it's column names, sizes, and data types) while simultaneously
formatting and caching data of interest (as an array, object or in JSON). While in the
process, add a Unique ID, Row Number, or Timestamps columns. Additionally, apply Sniffer
to check for patterns within the data and return locations.


### Uses
* Extracting CSV data into memory for integration into a database (relational or non relational)
* Building appropriately sized data tables
* Breaking apart CSV data into smaller chunks (and ultimately smaller tables)
* Transforming CSV data into another format for data consumption

### Overview
  ##### csv-multitool parses data to:
  * determine (or override) header values (or add when missing)
  * determine basic column data types (number, boolean, string, long, lob)
  * determine the maximum size of each column
  * determine the row count
  * determine and or limit the total size of the data cached
  * when set, check for and ignore rows with dubious SQL patterns
  * when set, append a Unique Id, Row Number, and/or Timestamp (in local or UTC time)
  * cache as an array, object or JSON

### Options

|Option|Function|
|------|--------|
|HEADER|ignores the first line of the CSV file (assumed to be the header) in lieu of a set of user defined header values|
|CACHE_DATASET|enables caching of data; to be returned as an array, object, or a JSON string|
|CACHE_LIMIT|the maximum amount of data permitted to be held in cache memory|
|BEGIN_CACHING_AT_ROW|sets the row caching starting point|
|END_PARSE_AT_ROW|sets the row parsing end point|
|EXCLUDE_ROWS| a set of rows to exclude from analysis and caching|
|UNIQUE_ID|appends a unique id column using the value set as name of the column|
|ROW_NUM|appends a row number column using the value set as name of the column|
|TIMESTAMP_UTC|appends an ISO standard timestamp column (in UTC) using the value set as name of the column|
|TIMESTAMP_LOCAL|appends an ISO standard timestamp column (in local time) using the value set as name of the column|
|SNIFFER_ON|uses a regex library to check for potentially harmful patterns; if present returns a "dataInQuestion" object with references to each cell in question|
|COLUMN_LIMIT|if data exceeds the COLUMN_LIMIT, row is not cached|
|HEADER_LIMIT|sets the maximum column data size is exceeded, an error is thrown|
|LONG_THRESHOLD|the threshold that determines when a string is a "long" as opposed to "string" data type|
|LOB_THRESHOLD|the threshold that determines when a string is a "lob" as opposed to "long" data type|
|STREAM_DATA|runs parsing as a data stream as opposed to analyzing an entire file before providing output|



|Option|Instructions|Example|
|------|------------|-------|
|HEADER|value must be an array of names; will default to using first row of file as header|```csvMultiTool('./file',{HEADER:['ROW1','ROW2']});```|
|CACHE_DATASET|must be one of the following: "array", "object", "json"; will default to 'array'|```csvMultiTool('./file',{CACHE_DATASET:'object'});```|
|CACHE_LIMIT|must be a number; default is set at 50000000|```csvMultiTool('./file',{CACHE_LIMIT:2000000});```|
|BEGIN_CACHING_AT_ROW|must be a number greater or equal to 1; will default to 1|```csvMultiTool('./file',{BEGIN_CACHING_AT_ROW:30});```|
|END_PARSE_AT_ROW|must be a number number greater or equal to 1; if not set, will perform a full file scan|```csvMultiTool('./file',{END_PARSE_AT_ROW:100});```|
|EXCLUDE_ROWS|value must be an array of numbers|```csvMultiTool('./file',{EXCLUDE_ROWS:[12,48,91]});```|
|UNIQUE_ID|value used will become the name of the UNIQUE_ID column|```csvMultiTool('./file',{UNIQUE_ID:'analysis_id'});```|
|ROW_NUM|value used will become the name of the ROW_NUM column|```csvMultiTool('./file',{ROW_NUM:'row'});```|
|TIMESTAMP_UTC|value used will become the name of the TIMESTAMP_UTC column|```csvMultiTool('./file',{TIMESTAMP_UTC:'analyzed_on'});```|
|TIMESTAMP_LOCAL|value used will become the name of the TIMESTAMP_LOCAL column|```csvMultiTool('./file',{TIMESTAMP_LOCAL:'analyzed_on'});```|
|SNIFFER_ON|is off by default; set to "yes" to turn on|```csvMultiTool('./file',{SNIFFER_ON:'yes'});```|
|COLUMN_LIMIT|must be a number; default is set at 100000|```csvMultiTool('./file',{COLUMN_LIMIT:4000});```|
