import { Bar, Tooltip, Legend, CartesianGrid, ComposedChart, YAxis, XAxis } from 'recharts';
import { dataEntry, ExitConfidenceLevel } from '../store/assessmentStore';
import { useState } from 'react';
import { useEffect } from 'react';


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

    return {
      name: name.split(':')[0],
      value: averageConfidence,
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
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <CartesianGrid stroke="#dadbdd" />
      <Bar dataKey="value" name="Exit Confidence" barSize={20} fill="#8db1d3" />
    </ComposedChart>
    </div>
  );
};

export default ExitConfidenceChart;

