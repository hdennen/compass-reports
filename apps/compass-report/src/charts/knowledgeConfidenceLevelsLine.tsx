import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { useAssessmentStore } from '../store/assessmentStore';
import { EntryConfidenceNames, QuestionAreaKeys } from '../enums';
import { useEffect, useState, useRef } from 'react';
import { getDisplayName } from '../utilities';
import { useResponseStore } from '../store/responseStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

interface ChartData {
  area: string;
  confidence: number;
  exitConfidence: number;
}

export function KnowledgeConfidenceLevelsLineChart() {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reported Knowledge vs. Assessment Score</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div style={{ width: '100%', height: 450 }} ref={chartRef}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="area"
              height={80}
              interval={0}
              tick={(props) => {
                const { x, y, payload } = props;
                const words = payload.value.split(' ');
                const lineHeight = 16;
                
                return (
                  <g>
                    {words.map((word: string, index: number) => (
                      <text
                        key={index}
                        x={x}
                        y={y + 12}
                        dy={index * lineHeight}
                        textAnchor="middle"
                        fill="#666"
                      >
                        {word}
                      </text>
                    ))}
                  </g>
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
                  'Assessment Score': colors.legendText,
                  'Very Limited': colors.legendText,
                  'Foundational': colors.legendText,
                  'Advanced': colors.legendText,
                  'Expert': colors.legendText
                };
                return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
              }}
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
            <Line 
            dataKey="actualKnowledge" 
            name="Assessment Score" 
            fill={colors.actualKnowledgeBar} 
          />  
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 