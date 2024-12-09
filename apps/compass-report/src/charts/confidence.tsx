import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { ConfidenceLevel } from '../enums';
import { useAssessmentStore } from '../store/assessmentStore';
import { ResponseActions, useResponseStore } from '../store/responseStore';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { getDisplayName } from '../utilities';
import { colors } from './colors';

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
      averageConfidence,
      actualAverage
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
      <div ref={chartRef}>
        <ComposedChart width={900} height={450} data={chartData} barGap={20}>
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
              const colors = {
                'Actual': '#000',
                'Confidence': '#000'
              };
              return <span style={{ color: colors[value as keyof typeof colors] }}>{value}</span>;
            }}
            payload={[
              {
                value: 'Actual',
                type: 'line',
                color: colors.actualKnowledgeArea,  // This controls the icon color
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
      </div>
    </div>
  );
}

export default ConfidenceChart;
