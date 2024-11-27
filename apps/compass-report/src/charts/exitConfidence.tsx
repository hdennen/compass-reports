import { Bar, Tooltip, Legend, CartesianGrid, ComposedChart, YAxis, XAxis, Area } from 'recharts';
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

const actualKnowledgeArea = {
    "Coverage": 91.42857143,
    "Coding and Billing": 85.71429,
    "Payment and Reimbursement": 79.59184,
    "Product Acquisition and Distribution": 93.87755,
    "Pricing and Contracting": 83.92857
  }

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

function calculateExitConfidence(data: dataEntry<dataEntry>[], questionText: string, areaName: string): any[] {
  const exitConfidenceData: { [key: string]: number[] } = {};

  data.forEach(item => {
    const exitConfidence = item[questionText];
    if (!exitConfidence) {
        console.warn('No exit confidence data found for ' + questionText);
        return;
    }

    Object.keys(exitConfidence).forEach(key => {
        const confidenceLevel = exitConfidence[key];
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
      actual: actualKnowledgeArea[areaName as keyof typeof actualKnowledgeArea] || 50, // TODO: this should be calculated based on scores. **********
    };
  });
}


export function ExitConfidenceChart({ data, name, questionText }: { data: dataEntry<dataEntry>[], name: string, questionText: string }) {
    const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      console.log('Data has been updated:', data);
      const calculatedData = calculateExitConfidence(data, questionText, name);
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
      <Area 
          type="monotone" 
          dataKey="actual" 
          name="Actual" 
          dot={areaDot} 
          fill="rgba(255,205,86,.5)" 
          stroke="#ffe5a9" 
        />
      <Bar dataKey="confidence" name="Exit Confidence" barSize={40} fill="#8db1d3" />
      {/* <Bar dataKey="actual" name="Actual" barSize={40} fill="rgba(41, 191, 0, .5)" /> */}
    </ComposedChart>
    </div>
  );
};

export default ExitConfidenceChart;

