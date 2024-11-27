import { useState } from 'react';
import ConfidenceChart from '../charts/confidence';
import { CsvImport } from '@compass/csv-import'
import { useAssessmentStore, AssessmentActions } from '../store/assessmentStore';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ExitConfidenceChart from '../charts/exitConfidence';

export function App() {
  const assessmentStore = useAssessmentStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="relative">
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <nav className="p-4 mt-12">
            <CsvImport<AssessmentActions> store={assessmentStore}/>
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
          <ConfidenceChart data={assessmentStore.transformedData} />
        </div>
        <div className="mb-8">
          <ExitConfidenceChart data={assessmentStore.transformedData} name="Coding and Billing" questionText="Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Coding and Billing section you just completed." />
        </div>
        <div className="mb-8">
          <ExitConfidenceChart data={assessmentStore.transformedData} name="Coverage" questionText="Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Coverage section you just completed." />
        </div>
        <div className="mb-8">
          <ExitConfidenceChart data={assessmentStore.transformedData} name="Payment and Reimbursement" questionText="Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Payment and Reimbursement section you just completed." />
        </div>
        <div className="mb-8">
          <ExitConfidenceChart data={assessmentStore.transformedData} name="Pricing and Contracting" questionText="Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Pricing and Contracting section you just completed." />
        </div>
        <div className="mb-8">
          <ExitConfidenceChart data={assessmentStore.transformedData} name="Product Acquisition and Distribution" questionText="Please take a moment to reflect on how confident you are about your knowledge relative to each subtopic covered in the Product Acquisition and Distribution section you just completed." />
        </div>

      </div>
    </div>
  );
}

export default App;
