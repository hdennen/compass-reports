import ConfidenceChart from '../charts/confidence';
import { CsvImport } from '@compass/csv-import'
import { useAssessmentStore, AssessmentActions } from '../store/assessmentStore';


export function App() {

  const assessmentStore = useAssessmentStore();

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="mb-8">
          <ConfidenceChart data={assessmentStore.transformedData} />
        </div>
        <div>
          <CsvImport<AssessmentActions> store={assessmentStore}/>
        </div>
      </div>
    </div>
  );
}

export default App;
