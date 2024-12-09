import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { useAssessmentStore } from '../store/assessmentStore';
import { ConfidenceLevel, QuestionAreaKeys, QuestionAreaNames } from '../enums';
import { useEffect, useState, useRef } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getDisplayName } from '../utilities';
import { useResponseStore } from '../store/responseStore';
import { colors } from './colors';

interface ChartData {
  area: string;
  confidence: number;
  exitConfidence: number;
}

export function ConfidenceComparison() {
  const { getConfidenceData, getExitConfidenceByArea, transformedData } = useAssessmentStore();
  const responseStore = useResponseStore();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const confidenceData = getConfidenceData();    
    const newChartData = Object.entries(confidenceData).map(([questionText, values]) => {
      const areaName = Object.keys(QuestionAreaKeys).find(key => QuestionAreaKeys[key as keyof typeof QuestionAreaKeys] === questionText);
      if (!areaName) {
        console.warn('No area name found for ' + questionText);
        return;
      }

      const averageExitConfidence = getExitConfidenceByArea<number>(areaName as QuestionAreaNames, 2);
      const averageConfidence = values.reduce((sum, val) => sum + (ConfidenceLevel[val as keyof typeof ConfidenceLevel]), 0) / values.length;

      const displayName = getDisplayName(questionText);
      const actualKnowledge = responseStore.getActualKnowledge()[questionText];

      return {     
        area: displayName,
        confidence: averageConfidence,
        exitConfidence: averageExitConfidence,
        actualKnowledge
      }
    });
    setChartData(newChartData);
  }, [transformedData, getConfidenceData, responseStore.transformedData]);

  const handleDownload = () => {
    if (chartRef.current) {
      // Use html-to-image to capture the chart
      import('html-to-image').then(({ toPng }) => {
        toPng(chartRef.current!)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'confidence-comparison.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Error downloading chart:', err);
          });
      });
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
    <div className="w-full flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Confidence Comparison</h1>
      <button
        onClick={handleDownload}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        title="Download Chart"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="area" 
            height={60}
            interval={0}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
                  <tspan x={x} textAnchor="middle">
                    {payload.value.length > 20 
                      ? `${payload.value.substring(0, 12)}...`
                      : payload.value}
                  </tspan>
                </text>
              );
            }}
          />
          <YAxis 
            domain={[0, 100]}
            label={{ 
              value: 'Confidence Level (%)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip />
          <Legend 
            formatter={(value) => {
              const textColors = {
                'Initial Confidence': colors.legendText,
                'Actual Knowledge': colors.legendText,
                'Exit Confidence': colors.legendText
              };
              return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
            }}
          />
          <Bar 
            dataKey="confidence" 
            name="Initial Confidence" 
            fill={colors.confidenceBar} 
          />
          <Bar 
            dataKey="actualKnowledge" 
            name="Actual Knowledge" 
            fill={colors.actualKnowledgeBar} 
          />
          <Bar 
            dataKey="exitConfidence" 
            name="Exit Confidence" 
            fill={colors.exitConfidenceBar} 
          />
  
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}; 