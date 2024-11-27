import { create } from 'zustand';

interface AssessmentState {
  rawData: { [key: string]: string }[]; 
  transformedData: dataEntry<dataEntry>[];
  isLoading: boolean;
  error: string | null;
}

export interface dataEntry<T = string | number | boolean | dataEntry<any>> {
  [key: string]: T;
}

export interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: () => void;
}

export enum ConfidenceLevel {
  'Very limited' = 65,
  'Foundational' = 75,
  'Advanced' = 85,
  'Expert' = 99
}

export enum ExitConfidenceLevel {
  'Completely unsure' = 65,
  'Slightly unsure' = 75,
  'Fairly sure' = 85,
  'Completely sure' = 99
}

export const useAssessmentStore = create<AssessmentState & AssessmentActions>((set, get) => ({
  rawData: [],
  transformedData: [],
  isLoading: false,
  error: null,
  setRawData: (data) => set({ rawData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  transformData: () => {
    const { rawData } = get();
    try {
      const transformed = transformToNestedStructure(rawData);
      set({ transformedData: transformed });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to transform data' });
      console.error(error);
    }
  },
}));

function transformToNestedStructure(rawData: any[]): dataEntry<dataEntry>[] {
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