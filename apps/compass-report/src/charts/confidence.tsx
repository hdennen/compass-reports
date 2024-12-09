import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar, ResponsiveContainer } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { ConfidenceLevel } from '../enums';
import { useAssessmentStore } from '../store/assessmentStore';
import { ResponseActions, useResponseStore } from '../store/responseStore';
import { getDisplayName } from '../utilities';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

function calculateChartData(responseStore: ResponseActions, confidenceData: {[key: string]: ConfidenceLevel[]}): any[] {
  const actualKnowledgeData = responseStore.getActualKnowledge();

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([questionText, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
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
        <h1 className="text-2xl font-bold text-gray-800">Entry Confidence vs Knowledge Score (AVG)</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} barGap={20}>
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
                      ? `${payload.value.substring(0, 12)}...`
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
            <Legend 
              formatter={(value) => {
                const textColors = {
                  'Actual': colors.legendText,
                  'Confidence': colors.legendText
                };
                return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
              }}
              payload={[
                {
                  value: 'Actual',
                  type: 'line',
                  color: colors.actualKnowledgeAreaStroke,  // This controls the icon color
                },
                {
                  value: 'Confidence',
                  type: 'rect',
                  color: colors.confidenceBar,  // This controls the icon color
                }
              ]}
            />
            <CartesianGrid 
              stroke="#dadbdd" 
            />
            <Area 
              type="monotone" 
              dataKey="actualAverage" 
              yAxisId="left"
              name="Actual" 
              dot={areaDot} 
              fill={colors.actualKnowledgeAreaFill} 
              stroke={colors.actualKnowledgeAreaStroke} 
            />
            <Bar 
              dataKey="averageConfidence"
              yAxisId="right"
              name="Confidence" 
              barSize={40} 
              fill={colors.confidenceBar}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ConfidenceChart;
