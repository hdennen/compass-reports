import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

export function ConfidenceChart({ data }: { data: Array<{
  name: string;
  before: number;
  after: number;
  amt: number;
}> }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confidence Comparison</h1>
      <ComposedChart width={730} height={450} data={data} barGap={20}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#dadbdd" />
        <Area 
          type="monotone" 
          dataKey="amt" 
          name="Average" 
          dot={areaDot} 
          fill="#ffe5a9" 
          stroke="#ffe5a9" 
        />
        <Bar 
          dataKey="before" 
          name="Confidence (Before)" 
          barSize={20} 
          fill="#8db1d3"
        />
        <Bar 
          dataKey="after" 
          name="Confidence (After)" 
          barSize={20} 
          fill="#50cb71"
        />
      </ComposedChart>
    </div>
  );
}

export default ConfidenceChart;
