import { Bar, Tooltip, Legend, CartesianGrid, ComposedChart, YAxis, XAxis } from 'recharts';
import { dataEntry, ExitConfidenceLevel } from '../store/assessmentStore';
import { useState } from 'react';
import { useEffect } from 'react';

// ++++++++++++ hard coded actual knowledge values ++++++++++++
const actualKnowledge = {
    "Billing processes": 80,
    "Coding": 70,
    "Authorization, denials, and appeals": 90,
    "Benefit design": 80,
    "Government programs and policies": 85,
    "Utilization management": 75,
    "Additive payment programs": 80,
    "Reimbursement models and rates": 90,
    "Regulatory": 80,
    "Benchmarks": 70,
    "Supply chain": 75,
    "Contract stakeholders": 80,
    "Payer contracting": 85,
    "Buy and bill": 75,
    "Specialty pharmacy": 80
}


function calculateExitConfidence(data: dataEntry<dataEntry>[], questionText: string): any[] {
  const exitConfidenceData: { [key: string]: number[] } = {};

  data.forEach(item => {
    const codingAndBillingExitConfidence = item[questionText];

    Object.keys(codingAndBillingExitConfidence).forEach(key => {
        const confidenceLevel = codingAndBillingExitConfidence[key];
        if (Object.values(ExitConfidenceLevel).includes(confidenceLevel as ExitConfidenceLevel)) {
        if (!exitConfidenceData[key]) {
            exitConfidenceData[key] = [];
        }

        exitConfidenceData[key].push(confidenceLevel as ExitConfidenceLevel);
        }
    });
  });

  // Transform the object into an array of data points
  return Object.entries(exitConfidenceData).map(([name, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ExitConfidenceLevel[val as keyof typeof ExitConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;

    const shortName = name.split(':')[0];

    return {
      name: shortName,
      confidence: averageConfidence,
      actual: actualKnowledge[shortName as keyof typeof actualKnowledge] || 50, // TODO: this should be calculated based on scores. **********
    };
  });
}


export function ExitConfidenceChart({ data, name, questionText }: { data: dataEntry<dataEntry>[], name: string, questionText: string }) {
    const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      console.log('Data has been updated:', data);
      const calculatedData = calculateExitConfidence(data, questionText);
      console.log(calculatedData);
      setConfidenceData(calculatedData);
    }
  }, [data]);


  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{name}</h1>
    <ComposedChart width={900} height={450} data={confidenceData} barGap={20}>  
      <XAxis 
        dataKey="name" 
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
      <Bar dataKey="confidence" name="Exit Confidence" barSize={40} fill="#8db1d3" />
      <Bar dataKey="actual" name="Actual" barSize={40} fill="rgba(41, 191, 0, .5)" />
    </ComposedChart>
    </div>
  );
};

export default ExitConfidenceChart;

