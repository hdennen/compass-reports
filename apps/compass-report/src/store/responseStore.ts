import { create } from 'zustand';
import { dataEntry } from '../types';

interface ResponseState {
  rawData: { [key: string]: string }[]; 
  transformedData: dataEntry<dataEntry>[];
  isLoading: boolean;
  error: string | null;
  threshold: number;
}

export interface ResponseActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: (transformer: (data: any[]) => dataEntry<dataEntry>[]) => void;
  setThreshold: (threshold: number) => void;
}

export const useResponseStore = create<ResponseState & ResponseActions>((set, get) => ({
  rawData: [],
  transformedData: [],
  isLoading: false,
  error: null,
  threshold: 70,
  setThreshold: (threshold: number) => set({ threshold }),
  setRawData: (data) => set({ rawData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  transformData: (transformer: (data: any[]) => dataEntry<dataEntry>[]) => {
    const { rawData } = get();
    try {
      const transformed = transformer(rawData);
      console.log('Transformed Data:', transformed);
      set({ transformedData: transformed });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to transform data' });
      console.error(error);
    }
  },
}));
