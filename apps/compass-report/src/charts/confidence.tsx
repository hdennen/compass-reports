import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { dataEntry, ConfidenceLevel } from '../store/assessmentStore';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

// ++++++++++++ hard coded actual knowledge values ++++++++++++
const actualKnowledge = {
  "Government and commercial healthcare coverage policies and procedures, including benefit design, denials and appeals, and utilization management strategies": 91.42857143,
  "Medical coding and billing which relates to the standardized medical coding systems used to represent diagnoses, procedures, services, products, and the processes involved in submitting and managing healthcare claims": 85.71429,
  "Payment and reimbursement, including reimbursement models, rates and incentive programs": 79.59184,
  "Product acquisition and distribution, including the buy and bill process, specialty pharmacy, and distribution channels": 93.87755,
  "Pricing and contracting, including pricing benchmarks, supply chain dynamics, regulatory compliance considerations, and the various stakeholders and their contracts": 83.92857
}

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

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([name, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;

    const actualAverage = actualKnowledge[name as keyof typeof actualKnowledge] || 50; // TODO: should be calculated from results and rubric

    return {
      name,
      averageConfidence,
      actualAverage
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
        <YAxis 
          yAxisId="left"
          orientation="left"
          domain={[0, 100]}  // Add domain for percentage scale
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          width={100}
          domain={[0, 100]}  // Add domain for percentage scale
          ticks={[25, 50, 75, 100]}
          tickFormatter={(value) => {
            const labels = {
              25: ConfidenceLevel[25],
              50: ConfidenceLevel[50],
              75: ConfidenceLevel[75],
              100: ConfidenceLevel[100]
            };
            return labels[value as keyof typeof labels] || value;
          }}
        />
        <Tooltip />
        <Legend />
        <CartesianGrid 
          stroke="#dadbdd" 
        />
        <Area 
          type="monotone" 
          dataKey="actualAverage" 
          yAxisId="left"
          name="Actual" 
          dot={areaDot} 
          fill="rgba(255,205,86,.5)" 
          stroke="#ffe5a9" 
        />
        <Bar 
          dataKey="averageConfidence"
          yAxisId="right"
          name="Confidence" 
          barSize={40} 
          fill="#8db1d3"
        />
      </ComposedChart>
    </div>
  );
}

export default ConfidenceChart;
