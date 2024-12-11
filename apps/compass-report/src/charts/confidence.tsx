import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line, Bar, ResponsiveContainer, LabelList } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { ConfidenceLevel } from '../enums';
import { useAssessmentStore } from '../store/assessmentStore';
import { ResponseActions, useResponseStore } from '../store/responseStore';
import { getDisplayName } from '../utilities';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';
import { Label } from 'recharts';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

function calculateChartData(responseStore: ResponseActions, confidenceData: {[key: string]: ConfidenceLevel[]}): any[] {
  const actualKnowledgeData = responseStore.getActualKnowledge();

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([questionText, values]) => {
    const totalConfidence = values.reduce((sum, val) => {
      const numericValue = Number(ConfidenceLevel[val]);
      return sum + numericValue;
    }, 0);
    const averageConfidence = totalConfidence / values.length;

    const actualAverage = actualKnowledgeData[questionText as keyof typeof actualKnowledgeData];

    const displayName = getDisplayName(questionText);

    return {
      name: displayName,
      averageConfidence: averageConfidence.toFixed(2),
      actualAverage: actualAverage.toFixed(2)
    };
  });
}

export function ConfidenceChart() {
  const assessmentStore = useAssessmentStore();
  const responseStore = useResponseStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (assessmentStore.transformedData.length > 0) {
      console.log('Confidence Chart Data has been updated:', assessmentStore.transformedData);
      const confidenceData = assessmentStore.getConfidenceData();
      const calculatedData = calculateChartData(responseStore, confidenceData);
      setChartData(calculatedData);
    }
  }, [assessmentStore.transformedData, responseStore.transformedData, responseStore.selectedCohort]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Self-Reported Knowledge vs. Assessment Score (AVG)</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} barGap={20}>
            <XAxis
              dataKey="name"
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
              yAxisId="left"
              orientation="left"
              domain={[0, 100]}
              label={{ 
                value: '(%)', 
                angle: -90, 
                position: 'insideLeft' 
              }}  // Add domain for percentage scale
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
            <Legend 
              formatter={(value) => {
                const textColors = {
                  'Assessment Score': colors.legendText,
                  'Self-Reported Knowledge': colors.legendText
                };
                return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
              }}
              payload={[
                {
                  value: 'Assessment Score',
                  type: 'line',
                  color: colors.actualKnowledgeAreaStroke,  // This controls the icon color
                },
                {
                  value: 'Self-Reported Knowledge',
                  type: 'rect',
                  color: colors.confidenceBar,  // This controls the icon color
                }
              ]}
            />
            <CartesianGrid 
              stroke="#dadbdd" 
            />
            <Line 
              type="monotone" 
              dataKey="actualAverage" 
              yAxisId="left"
              name="Assessment Score" 
              dot={areaDot} 
              stroke={colors.actualKnowledgeAreaStroke}
              strokeWidth={3}
            >
              <LabelList 
                dataKey="actualAverage"
                position="top"
                offset={-15}
                formatter={(value: string) => `${value}%`}
                style={{
                  fontSize: '12px',
                  fill: '#3d3d3d',
                  fontWeight: 600
                }}
              />
            </Line>
            <Bar 
              dataKey="averageConfidence"
              yAxisId="right"
              name="Self-Reported Knowledge" 
              barSize={60}
              fill={colors.confidenceBar}
            >
              <LabelList 
                dataKey="averageConfidence" 
                position="middle"
                fontWeight={600}
                fontSize={10}
                fill="white"
                formatter={(value: string) => `${value}%`}
              />  
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ConfidenceChart;
