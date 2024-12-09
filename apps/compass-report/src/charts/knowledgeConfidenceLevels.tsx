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
import { EntryConfidenceNames, QuestionAreaKeys } from '../enums';
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

export function KnowledgeConfidenceLevelsChart() {
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

      const counts = values.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const displayName = getDisplayName(questionText);
      const actualKnowledge = responseStore.getActualKnowledge()[questionText];

      return {     
        area: displayName,
        actualKnowledge: actualKnowledge.toFixed(2),
        veryLimited: (counts[EntryConfidenceNames.VeryLimited] / values.length * 100 || 0).toFixed(2),
        foundational: (counts[EntryConfidenceNames.Foundational] / values.length * 100 || 0).toFixed(2),
        advanced: (counts[EntryConfidenceNames.Advanced] / values.length * 100 || 0).toFixed(2),
        expert: (counts[EntryConfidenceNames.Expert] / values.length * 100 || 0).toFixed(2)
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
      <h1 className="text-2xl font-bold text-gray-800">Knowledge vs. Entry Confidence Detail View</h1>
      <button
        onClick={handleDownload}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        title="Download Chart"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      </div>
      <div style={{ width: '100%', height: 400 }} ref={chartRef}>
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
                'Actual Knowledge': colors.legendText,
                'Very Limited': colors.legendText,
                'Foundational': colors.legendText,
                'Advanced': colors.legendText,
                'Expert': colors.legendText
              };
              return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
            }}
          />
          <Bar 
            dataKey="actualKnowledge" 
            name="Actual Knowledge" 
            fill={colors.actualKnowledgeBar} 
          />  
          <Bar 
            dataKey="veryLimited" 
            name="Very Limited" 
            fill={colors.veryLimited} 
            stackId="stack"
          />
          <Bar 
            dataKey="foundational" 
            name="Foundational" 
            fill={colors.foundational} 
            stackId="stack"
          />
          <Bar 
            dataKey="advanced" 
            name="Advanced" 
            fill={colors.advanced} 
            stackId="stack"
          />
          <Bar 
            dataKey="expert" 
            name="Expert" 
            fill={colors.expert} 
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  );
}; 