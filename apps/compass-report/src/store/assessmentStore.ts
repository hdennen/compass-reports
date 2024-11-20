import { create } from 'zustand';

interface AssessmentState {
  rawData: any[]; // Replace 'any' with your specific data type
  transformedData: { [key: string]: string | number | boolean  }[];
  isLoading: boolean;
  error: string | null;
}

interface dataEntry {
  [key: string]: string | number | boolean;
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

function transformToNestedStructure(rawData: any[], primaryKey: string = 'Respondent ID'): any {
  const dataMap: {[key: string]: dataEntry} = {};

  const subHeaders = rawData.shift();
  console.log(subHeaders);
  console.log(rawData);

  rawData.forEach(item => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        if (item[key] === "Response") {
          
        }
      }
    }
  });

  return Object.values(dataMap);
}