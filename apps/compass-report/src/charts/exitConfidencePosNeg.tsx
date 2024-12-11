import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import { useAssessmentStore } from "../store/assessmentStore";
import { ExitConfidenceNames } from "../enums";
import { colors } from "./colors";
import { useEffect, useRef, useState } from "react";
import { getDisplayNameForExitConfidence } from "../utilities";
import { DownloadButton } from "../components/downloadButton";

export function ExitConfidencePosNegChart() {
  const { getExitConfidenceCounts, transformedData } = useAssessmentStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);


  useEffect(() => {
    const confidenceCounts = getExitConfidenceCounts();
  
    const newChartData = Object.keys(confidenceCounts)
      .map((key, value) => ({
        area: getDisplayNameForExitConfidence(key),
        completelySure: confidenceCounts[key][ExitConfidenceNames.CompletelySure] || 0,
        fairlySure: confidenceCounts[key][ExitConfidenceNames.FairlySure] || 0,
        slightlyUnsure: -confidenceCounts[key][ExitConfidenceNames.SlightlyUnsure] || 0,
        completelyUnsure: -confidenceCounts[key][ExitConfidenceNames.CompletelyUnsure] || 0,
    }));
    setChartData(newChartData);
  }, [transformedData, getExitConfidenceCounts]);  

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exit Confidence Detail View (total count)</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            barGap={20}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            stackOffset="sign"
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
              label={{ 
                value: 'Response Count', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
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
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="slightlyUnsure" name="Slightly unsure" fill={colors[ExitConfidenceNames.SlightlyUnsure]} stackId="stack">
              <LabelList 
                dataKey="slightlyUnsure" 
                position="center" 
                formatter={(value: number) => value < 0 ? Math.abs(value) : ''} 
                style={{ fill: 'white', fontWeight: 'bold', fontSize: '10px' }}
              />
            </Bar>
            <Bar dataKey="completelyUnsure" name="Completely unsure" fill={colors[ExitConfidenceNames.CompletelyUnsure]} stackId="stack">
              <LabelList 
                dataKey="completelyUnsure" 
                position="center" 
                formatter={(value: number) => value < 0 ? Math.abs(value) : ''} 
                style={{ fill: 'white', fontWeight: 'bold', fontSize: '10px' }}
              />
            </Bar>
            <Bar dataKey="fairlySure" name="Fairly sure" fill={colors[ExitConfidenceNames.FairlySure]} stackId="stack">
              <LabelList 
                dataKey="fairlySure" 
                position="center" 
                formatter={(value: number) => value > 0 ? value : ''} 
                style={{ fill: 'white', fontWeight: 'bold', fontSize: '10px' }}
              />
            </Bar>
            <Bar dataKey="completelySure" name="Completely sure" fill={colors[ExitConfidenceNames.CompletelySure]} stackId="stack">
              <LabelList 
                dataKey="completelySure" 
                position="center" 
                formatter={(value: number) => value > 0 ? value : ''} 
                style={{ fill: 'white', fontWeight: 'bold', fontSize: '10px' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExitConfidencePosNegChart;