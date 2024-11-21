import { create } from 'zustand';

interface AssessmentState {
  rawData: { [key: string]: string }[]; 
  transformedData: { [key: string]: string | number | boolean | { [key: string]: string } }[];
  isLoading: boolean;
  error: string | null;
}

interface dataEntry<T = string | number | boolean> {
  [key: string]: T;
}

export interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: () => void;
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
    }
  },
}));

function transformToNestedStructure(rawData: any[], primaryKey: string = 'Respondent ID'): dataEntry<dataEntry>[] {
  const dataMap: {[key: string]: dataEntry } = {};

  const subHeaders = rawData.shift();
  console.log(subHeaders);

  const transformedToRecordsAsObjects = consolidateSubHeadersIntoRawData(rawData, subHeaders);
  console.log(transformedToRecordsAsObjects);

  const transformedToConsolidatedHeaders = consolidateHeaders(transformedToRecordsAsObjects);
  console.log(transformedToConsolidatedHeaders);
  return Object.values(dataMap);
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

function consolidateHeaders(subHeaderedDataRecords: dataEntry<dataEntry>[]): dataEntry<dataEntry[]>[] {
  
  

  return dataMap;
}