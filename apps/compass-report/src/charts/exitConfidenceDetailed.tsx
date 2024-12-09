import { Bar, Tooltip, Legend, CartesianGrid, YAxis, XAxis, ResponsiveContainer, BarChart, ReferenceLine } from 'recharts';
import { ExitConfidenceNames, QuestionAreaNames } from '../enums';
import { useState, useEffect, useRef } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

function calculateChartData(exitConfidenceData: { [key: string]: string[] }): any[] {

  return Object.entries(exitConfidenceData).map(([key, values]) => {

    const shortName = key.split(':')[0];

    return {
      name: shortName,
      completelySure: values.filter(val => val === ExitConfidenceNames.CompletelySure).length,
      fairlySure: values.filter(val => val === ExitConfidenceNames.FairlySure).length,
      slightlyUnsure: -values.filter(val => val === ExitConfidenceNames.SlightlyUnsure).length,
      completelyUnsure: -values.filter(val => val === ExitConfidenceNames.CompletelyUnsure).length,
    };
  });
}

interface ExitConfidenceChartProps {
  areaName: QuestionAreaNames;
}


export function ExitConfidenceDetailedChart({ areaName }: ExitConfidenceChartProps) {
  const [confidenceData, setConfidenceData] = useState<any[]>([]);
  const { getExitConfidenceByArea, transformedData } = useAssessmentStore();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transformedData.length > 0) {
      const exitConfidenceData = getExitConfidenceByArea<{ [key: string]: string[] }>(areaName as QuestionAreaNames);
      const calculatedData = calculateChartData(exitConfidenceData);
      setConfidenceData(calculatedData);
    }
  }, [transformedData]);

  return (
    <div className="flex flex-col items-center w-full mt-[-50px]">
      <div className="w-full flex justify-between items-center mb-0">
        <div className="ml-auto">
          <DownloadButton chartRef={chartRef} />
        </div>
      </div>
      <div className="p-6" style={{ width: '100%', height: 400 }} ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={confidenceData} 
            barGap={20}
            stackOffset="sign"
          >  
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
            <YAxis 
              domain={[0, confidenceData.reduce((max, item) => Math.max(max, item.completelySure + item.fairlySure + item.slightlyUnsure + item.completelyUnsure), 0)]}
              label={{ 
                value: 'Respondents', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip />
            <Legend 
                formatter={(value) => {
                  const textColors = {
                    'Completely sure': colors.legendText,
                    'Fairly sure': colors.legendText,
                    'Slightly unsure': colors.legendText,
                    'Completely unsure': colors.legendText
                  };
                  return <span style={{ color: textColors[value as keyof typeof textColors] }}>{value}</span>;
                }}
              />
            <CartesianGrid stroke="#dadbdd" />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="slightlyUnsure" name="Slightly unsure" fill={colors[ExitConfidenceNames.SlightlyUnsure]} stackId="stack" />
            <Bar dataKey="completelyUnsure" name="Completely unsure" fill={colors[ExitConfidenceNames.CompletelyUnsure]} stackId="stack" />
            <Bar dataKey="fairlySure" name="Fairly sure" fill={colors[ExitConfidenceNames.FairlySure]} stackId="stack" />
            <Bar dataKey="completelySure" name="Completely sure" fill={colors[ExitConfidenceNames.CompletelySure]} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};

export default ExitConfidenceDetailedChart;

