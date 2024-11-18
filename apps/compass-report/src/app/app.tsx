import ConfidenceChart from '../charts/confidence';
import { CsvImport } from '@compass/csv-import'
import { useAssessmentStore, AssessmentState } from '../store/assessmentStore';

const data = [
  {
    name: 'Area 1',
    before: 600,
    after: 800,
    amt: 700,
  },
  {
    name: 'Area 2', 
    before: 400,
    after: 900,
    amt: 650,
  },
  {
    name: 'Area 3',
    before: 500,
    after: 600,
    amt: 550,
  },
  {
    name: 'Area 4',
    before: 800,
    after: 650,
    amt: 725,
  },
  {
    name: 'Area 5',
    before: 700,
    after: 600,
    amt: 650,
  },

];


export function App() {

  const assessmentStore = useAssessmentStore();

  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="mb-8">
          <ConfidenceChart data={data} />
        </div>
        <div>
          <CsvImport<AssessmentState> store={assessmentStore}/>
        </div>
      </div>
    </div>
  );
}

export default App;
