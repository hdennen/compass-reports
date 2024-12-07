import { create } from 'zustand';
import { dataEntry } from '../types';
import { CohortAreaConfig } from '../data';

interface ResponseState {
  rawData: { [key: string]: string }[]; 
  transformedData: dataEntry<dataEntry>[];
  isLoading: boolean;
  error: string | null;
  threshold: number;
  selectedCohort: string;
}

export interface ResponseActions {
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  transformData: (transformer: (data: any[]) => dataEntry<dataEntry>[]) => void;
  setThreshold: (threshold: number) => void;
  setSelectedCohort: (cohort: string) => void;
  getActualKnowledge: () => {[key: string]: number};
}

function calculateActualKnowledge(transformedData: dataEntry<dataEntry>[], selectedCohort: string): {[key: string]: number} {
  const actualKnowledgeData: {[key: string]: number} = {};
  const cohortConfig = CohortAreaConfig[selectedCohort as keyof typeof CohortAreaConfig];

  Object.keys(cohortConfig).forEach(section => {
    let totalPointsAwarded = 0;
    let totalPointsAvailable = 0;
    let scoreCount = 0;
  
    cohortConfig[section as keyof typeof cohortConfig].forEach(questionKey => {
      transformedData.forEach(respondent => {
        const responseData = respondent[questionKey];
        if (responseData && responseData.Points) {
          const [pointsAwardedStr, pointsAvailableStr] = responseData.Points.toString().split('/');
          const pointsAwarded = parseFloat(pointsAwardedStr);
          const pointsAvailable = parseFloat(pointsAvailableStr);
  
          if (!isNaN(pointsAwarded) && !isNaN(pointsAvailable) && pointsAvailable > 0) {
            scoreCount++;
            totalPointsAwarded += pointsAwarded;
            totalPointsAvailable += pointsAvailable;
          }
        }
      });
    });

    actualKnowledgeData[section] = scoreCount > 0 ? (totalPointsAwarded / totalPointsAvailable) * 100 : 0;
  })

  return actualKnowledgeData;
}

export const useResponseStore = create<ResponseState & ResponseActions>((set, get) => ({
  rawData: [],
  transformedData: [],
  isLoading: false,
  error: null,
  threshold: 70,
  selectedCohort: 'C1',
  setThreshold: (threshold: number) => set({ threshold }),
  setSelectedCohort: (cohort: string) => set({ selectedCohort: cohort }),
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
  getActualKnowledge: () => {
    const { transformedData, selectedCohort } = get();
    return calculateActualKnowledge(transformedData, selectedCohort);
  },
}));
