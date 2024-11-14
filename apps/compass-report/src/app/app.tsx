import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { XlsxImport } from '@compass/xlsx-import'; // Add this import

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confidence Comparison</h1>
        <ComposedChart width={730} height={450} data={data} barGap={20}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#dadbdd" />
          <Area type="monotone" dataKey="amt" name="Average" dot={areaDot} fill="#ffe5a9" stroke="#ffe5a9" />
          <Bar dataKey="before" name="Confidence (Before)" barSize={20} fill="#8db1d3"/>
          <Bar dataKey="after" name="Confidence (After)" barSize={20} fill="#50cb71"/>
        </ComposedChart>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-8">
        <XlsxImport />
      </div>
    </div>
  );
}

export default App;
