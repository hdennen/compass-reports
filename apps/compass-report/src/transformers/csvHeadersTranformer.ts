import { dataEntry } from '../types';
export function transformToNestedStructure(rawData: any[]): dataEntry<dataEntry>[] {
    const subHeaders = rawData.shift();
  
    const transformedToRecordsAsObjects = consolidateSubHeadersIntoRawData(rawData, subHeaders);
    const transformedToConsolidatedHeaders = consolidateHeaders(transformedToRecordsAsObjects);

    return transformedToConsolidatedHeaders
  }
  
  function consolidateSubHeadersIntoRawData(rawData: dataEntry<dataEntry>[], subHeaders: dataEntry): dataEntry<dataEntry>[] {
    const transformed = rawData.map(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key) && subHeaders[key] !== "") {
          item[key] = { [String(subHeaders[key])]: item[key] };
        }
      }
      return item;
    });
  
    return transformed;
  }
  
  function consolidateHeaders(subHeaderedDataRecords: dataEntry<dataEntry>[]): dataEntry<dataEntry>[] {
    const consolidatedDataRecords: dataEntry<dataEntry>[] = [];
    
    subHeaderedDataRecords.forEach(record => {
      const consolidatedRecord: dataEntry<dataEntry> = {};
  
      for (const key in record) {
        if (record.hasOwnProperty(key)) {
          const value = record[key];
          const splitKey = key.split(/_(?=\d)/);
  
          if (splitKey.length > 1) {
            consolidatedRecord[splitKey[0]] = Object.assign(consolidatedRecord[splitKey[0]], value);
          } else {
            consolidatedRecord[key] = value;
          }
          
        }
      }
      consolidatedDataRecords.push(consolidatedRecord);
    });
  
    return consolidatedDataRecords;
  }