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
  ReferenceLine,
} from "recharts";
import { useAssessmentStore } from "../store/assessmentStore";
import { ExitConfidenceKeys, ExitConfidenceNames, QuestionAreaNames } from "../enums";
import { colors } from "./colors";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { getDisplayNameForExitConfidence } from "../utilities";

export function ExitConfidencePosNegChart() {
  const { getExitConfidenceCounts, transformedData } = useAssessmentStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);


  useEffect(() => {
    const confidenceCounts = getExitConfidenceCounts();
  
    const newChartData = Object.keys(confidenceCounts)
      // .sort(([a], [b]) => a.localeCompare(b))
      .map((key, value) => ({
        area: getDisplayNameForExitConfidence(key),
        completelySure: confidenceCounts[key][ExitConfidenceNames.CompletelySure],
        fairlySure: confidenceCounts[key][ExitConfidenceNames.FairlySure],
        slightlyUnsure: -confidenceCounts[key][ExitConfidenceNames.SlightlyUnsure],
        completelyUnsure: -confidenceCounts[key][ExitConfidenceNames.CompletelyUnsure],
    }));
    setChartData(newChartData);
  }, [transformedData, getExitConfidenceCounts]);  

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
        <h1 className="text-2xl font-bold text-gray-800">Exit Confidence</h1>
        <button
          onClick={handleDownload}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          title="Download Chart"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
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
            <YAxis />
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
            <Bar dataKey="completelySure" name="Completely sure" fill={colors[ExitConfidenceNames.CompletelySure]} stackId="stack" />
            <Bar dataKey="fairlySure" name="Fairly sure" fill={colors[ExitConfidenceNames.FairlySure]} stackId="stack" />
            <Bar dataKey="slightlyUnsure" name="Slightly unsure" fill={colors[ExitConfidenceNames.SlightlyUnsure]} stackId="stack" />
            <Bar dataKey="completelyUnsure" name="Completely unsure" fill={colors[ExitConfidenceNames.CompletelyUnsure]} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExitConfidencePosNegChart;