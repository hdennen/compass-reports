import { useState } from 'react';
import ConfidenceChart from '../charts/confidence';
import { CsvImport } from '@compass/csv-import'
import { useAssessmentStore, AssessmentActions } from '../store/assessmentStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { transformToNestedStructure } from '../transformers/csvHeadersTranformer';
import { transformToQuestionId } from '../transformers/questionIdTransformer';
import { useResponseStore } from '../store/responseStore';

export function App() {
  const assessmentStore = useAssessmentStore();
  const responseStore = useResponseStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="relative">
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <nav className="p-4 mt-12">
          <div className="my-4">
            <CsvImport<AssessmentActions> store={assessmentStore} buttonText="Choose Cohort CSV" transformer={transformToNestedStructure}/>
          </div>
          <div className="my-4">
            <CsvImport<AssessmentActions> store={responseStore} buttonText="Choose Responses CSV" transformer={(data)=>transformToQuestionId(transformToNestedStructure(data)) /* clunky argument structure here */}/>
          </div>
        </nav>
      </div>


      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">

      <button
          className="fixed top-4 left-4 z-10 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
        >
          {isDrawerOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        <div className="mb-8">
          <ConfidenceChart assessmentData={assessmentStore.transformedData} responseData={responseStore.transformedData} />
        </div>
      </div>
    </div>
  );
}

export default App;
