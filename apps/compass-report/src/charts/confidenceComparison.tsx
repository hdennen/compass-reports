import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { useAssessmentStore } from '../store/assessmentStore';
import { ConfidenceLevel, QuestionAreaKeys, QuestionAreaNames } from '../enums';
import { useEffect, useState, useRef } from 'react';
import { getDisplayName } from '../utilities';
import { useResponseStore } from '../store/responseStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

interface ChartData {
  area: string;
  confidence: number;
  exitConfidence: number;
  actualKnowledge: number;
}

export function ConfidenceComparison() {
  const { getConfidenceData, getExitConfidenceByArea, transformedData } = useAssessmentStore();
  const responseStore = useResponseStore();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const confidenceData = getConfidenceData();    
    const newChartData = Object.entries(confidenceData)
      .map(([questionText, values]) => {
        const areaName = Object.keys(QuestionAreaKeys).find(key => QuestionAreaKeys[key as keyof typeof QuestionAreaKeys] === questionText);
        if (!areaName) {
          console.warn('No area name found for ' + questionText);
          return null;
        }

        const averageExitConfidence = getExitConfidenceByArea<number>(areaName as QuestionAreaNames, 2);
        const averageConfidence = values.reduce((sum, val) => sum + (ConfidenceLevel[val as keyof typeof ConfidenceLevel]), 0) / values.length;

        const displayName = getDisplayName(questionText);
        const actualKnowledge = responseStore.getActualKnowledge()[questionText];

        return {     
          area: displayName,
          confidence: Number(averageConfidence.toFixed(2)),
          exitConfidence: Number(averageExitConfidence.toFixed(2)),
          actualKnowledge: Number(actualKnowledge.toFixed(2))
        }
      })
      .filter((item): item is ChartData => item !== null);
    setChartData(newChartData);
  }, [transformedData, getConfidenceData, responseStore.transformedData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Self-Reported Knowledge vs Assessment Score vs Exit Confidence (AVG)</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div style={{ width: '100%', height: 450 }} ref={chartRef}>
        <ResponsiveContainer>
          <BarChart
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
                value: '(%)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip />
            <Legend 
              formatter={(value) => {
                const textColors = {
                  'Self-Reported Knowledge': colors.legendText,
                  'Assessment Score': colors.legendText,
                  'Exit Confidence': colors.legendText
                };
                return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
              }}
            />
            <Bar 
              dataKey="confidence" 
              name="Self-Reported Knowledge" 
              fill={colors.confidenceBar} 
            >
              <LabelList 
                dataKey="confidence" 
                position="center"
                style={{ 
                  fill: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }}
                formatter={(value: number) => (value > 0 ? `${value}%` : '')}
              />
            </Bar>
            <Bar 
              dataKey="actualKnowledge" 
              name="Assessment Score" 
              name="Assessment Score" 
              fill={colors.actualKnowledgeBar} 
            >
              <LabelList 
                dataKey="actualKnowledge" 
                position="center"
                style={{ 
                  fill: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }}
                formatter={(value: number) => (value > 0 ? `${value}%` : '')}
              />
            </Bar>
            <Bar 
              dataKey="exitConfidence" 
              name="Exit Confidence" 
              fill={colors.exitConfidenceBar} 
            >
              <LabelList 
                dataKey="exitConfidence" 
                position="center"
                style={{ 
                  fill: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px'
                }}
                formatter={(value: number) => (value > 0 ? `${value}%` : '')}
              />
            </Bar>
    
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 