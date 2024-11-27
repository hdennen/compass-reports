import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { dataEntry, ConfidenceLevel } from '../store/assessmentStore';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

function calculateConfidence(data: dataEntry<dataEntry>[]): any[] {
  const confidenceData: {[key: string]: ConfidenceLevel[]} = {};

  data.forEach(item => {
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
  console.log(confidenceData);

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([name, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;


    // ++++++++++++ DUMMY DATA FOR TESTING ++++++++++++
    const randomOffset = Math.floor(Math.random() * 8) + 1;
    const randomDirection = Math.random() < 0.5 ? -1 : 1;
    const randomValue = averageConfidence + (randomOffset * randomDirection);
    // ++++++++++++ END DUMMY DATA FOR TESTING ++++++++++++

    return {
      name,
      averageConfidence,
      actualAverage: Math.max(0, Math.min(100, randomValue)),
    };
  });
}

export function ConfidenceChart({ data }: { data: dataEntry<dataEntry>[] }) {
  const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      console.log('Data has been updated:', data);
      const calculatedData = calculateConfidence(data);
      setConfidenceData(calculatedData);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confidence Comparison</h1>
      <ComposedChart width={900} height={450} data={confidenceData} barGap={20}>
        <XAxis
          dataKey="name"
          height={60}
          interval={0}
          tick={(props) => {
            const { x, y, payload } = props;
            return (
              <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
                <tspan x={x} textAnchor="middle">
                  {payload.value.length > 20 
                    ? `${payload.value.substring(0, 10)}...`
                    : payload.value}
                </tspan>
              </text>
            );
          }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#dadbdd" />
        <Area 
          type="monotone" 
          dataKey="actualAverage" 
          name="Average" 
          dot={areaDot} 
          fill="rgba(255,205,86,.5)" 
          stroke="#ffe5a9" 
        />
        <Bar 
          dataKey="averageConfidence"
          name="Confidence" 
          barSize={20} 
          fill="#8db1d3"
        />
      </ComposedChart>
    </div>
  );
}

export default ConfidenceChart;
