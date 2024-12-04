import { create } from 'zustand';
import { dataEntry } from '../types';
import { ConfidenceLevel } from '../enums';

interface AssessmentState {
  rawData: { [key: string]: string }[]; 
  transformedData: dataEntry<dataEntry>[];
  confidenceData: {[key: string]: ConfidenceLevel[]};
  isLoading: boolean;
  error: string | null;
}

export interface AssessmentActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: (transformer: (data: any[]) => dataEntry<dataEntry>[]) => void;
  getConfidenceData: () => {[key: string]: ConfidenceLevel[]};
}

function calculateConfidence(assessmentData: dataEntry<dataEntry>[]): {[key: string]: ConfidenceLevel[]} {
  const confidenceData: {[key: string]: ConfidenceLevel[]} = {};

  assessmentData.forEach(item => {
    Object.keys(item).forEach(key => {
      const value = item[key];

      if (typeof value === 'object' && value !== null && value.Response) {
        const confidenceLevel = value.Response;
        if (Object.values(ConfidenceLevel).includes(confidenceLevel as ConfidenceLevel)) {
          if (!confidenceData[key]) {
            confidenceData[key] = [];
          }
          confidenceData[key].push(confidenceLevel as ConfidenceLevel);
        }
      }
    });
  });

  return confidenceData;
}

export const useAssessmentStore = create<AssessmentState & AssessmentActions>((set, get) => ({
  rawData: [],
  transformedData: [],
  isLoading: false,
  error: null,
  confidenceData: {},
  getConfidenceData: () => {
    const { confidenceData } = get();
    if (Object.keys(confidenceData).length === 0) {
      const { transformedData } = get();
      const calculatedConfidenceData = calculateConfidence(transformedData);
      set({ confidenceData: calculatedConfidenceData });
      return calculatedConfidenceData;
    }
    return confidenceData;
  },
  setRawData: (data) => set({ rawData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  transformData: (transformer: (data: any[]) => dataEntry<dataEntry>[]) => {
    const { rawData } = get();
    try {
      const transformed = transformer(rawData);
      set({ transformedData: transformed });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to transform data' });
      console.error(error);
    }
  },
}));
