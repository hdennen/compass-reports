import { useState } from 'react';
import ConfidenceChart from '../charts/confidence';
import { CsvImport } from '@compass/csv-import'
import { useAssessmentStore, AssessmentActions } from '../store/assessmentStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { transformToNestedStructure } from '../transformers/csvHeadersTranformer';
import { transformToQuestionId } from '../transformers/questionIdTransformer';
import { useResponseStore, ResponseActions } from '../store/responseStore';
import { SectionAnalysis } from '../components/sectionAnalysis';
import { C1SectionQuestions } from '../data';
import { QuestionAreaKeys, QuestionAreaNames } from '../enums';

export function App() {
  const assessmentStore = useAssessmentStore();
  const responseStore = useResponseStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="relative">
      <div className={`fixed inset-y-0 left-0 w-75 min-w-[16rem] bg-white shadow-lg transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <nav className="p-4 mt-12">
          <div className="my-4">
            <CsvImport<AssessmentActions> store={assessmentStore} buttonText="Choose Cohort CSV" transformer={transformToNestedStructure}/>
          </div>
          <div className="my-4">
            <CsvImport<ResponseActions> store={responseStore} buttonText="Choose Responses CSV" transformer={(data)=>transformToQuestionId(transformToNestedStructure(data)) /* clunky argument structure here */}/>
          </div>
          <div className="my-4">
          <div className="my-4">
            <label htmlFor="thresholdSlider" className="block text-sm font-medium text-gray-700">Set Threshold: {responseStore.threshold}%</label>
            <input
              id="thresholdSlider"
              type="range"
              min="0"
              max="100"
              value={responseStore.threshold}
              onChange={(e) => responseStore.setThreshold(Number(e.target.value))}
              className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          </div>
        </nav>
      </div>


      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-8">
        <div className="w-full max-w-[960px] mx-auto">
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
            <ConfidenceChart />
          </div>
          <div className="mb-8">
            <SectionAnalysis sectionName={QuestionAreaNames.CodingAndBilling} sectionKey={QuestionAreaKeys.CodingAndBilling} sectionQuestions={C1SectionQuestions[QuestionAreaKeys.CodingAndBilling]} />
          </div>
          <div className="mb-8">
            <SectionAnalysis sectionName={QuestionAreaNames.Coverage} sectionKey={QuestionAreaKeys.Coverage} sectionQuestions={C1SectionQuestions[QuestionAreaKeys.Coverage]} />
          </div>
          <div className="mb-8">
            <SectionAnalysis sectionName={QuestionAreaNames.PaymentAndReimbursement} sectionKey={QuestionAreaKeys.PaymentAndReimbursement} sectionQuestions={C1SectionQuestions[QuestionAreaKeys.PaymentAndReimbursement]} />
          </div>
          <div className="mb-8">
            <SectionAnalysis sectionName={QuestionAreaNames.PricingAndContracting} sectionKey={QuestionAreaKeys.PricingAndContracting} sectionQuestions={C1SectionQuestions[QuestionAreaKeys.PricingAndContracting]} />
          </div>
          <div className="mb-8">
            <SectionAnalysis sectionName={QuestionAreaNames.ProductAcquisitionAndDistribution} sectionKey={QuestionAreaKeys.ProductAcquisitionAndDistribution} sectionQuestions={C1SectionQuestions[QuestionAreaKeys.ProductAcquisitionAndDistribution]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
