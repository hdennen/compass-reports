import { Bar, Tooltip, Legend, CartesianGrid, ComposedChart, YAxis, XAxis, Area, ResponsiveContainer, BarChart } from 'recharts';
import { dataEntry } from '../types';
import { ExitConfidenceKeys, ExitConfidenceLevel, QuestionAreaNames } from '../enums';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';

function calculateChartData(exitConfidenceData: { [key: string]: string[] }): any[] {

  return Object.entries(exitConfidenceData).map(([key, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ExitConfidenceLevel[val as keyof typeof ExitConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;

    const shortName = key.split(':')[0];

    return {
      name: shortName,
      confidence: averageConfidence
    };
  });
}

interface ExitConfidenceChartProps {
  areaName: QuestionAreaNames;
}


export function ExitConfidenceChart({ areaName }: ExitConfidenceChartProps) {
    const [confidenceData, setConfidenceData] = useState<any[]>([]);
    const { getExitConfidenceByArea, transformedData } = useAssessmentStore();

  useEffect(() => {
    if (transformedData.length > 0) {
      const exitConfidenceData = getExitConfidenceByArea<{ [key: string]: string[] }>(areaName as QuestionAreaNames);
      const calculatedData = calculateChartData(exitConfidenceData);
      setConfidenceData(calculatedData);
    }
  }, [transformedData]);


  return (
    <div className="p-6" style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={confidenceData} barGap={20}>  
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
          <Bar dataKey="confidence" name="Exit Confidence" fill="#8db1d3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExitConfidenceChart;

