import { XlsxImport } from '@compass/xlsx-import'; // Add this import
import ConfidenceChart from '../charts/confidence';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5}

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
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <ConfidenceChart data={data} />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
      <XlsxImport />
      </div>
    </div>
  );
}

export default App;
