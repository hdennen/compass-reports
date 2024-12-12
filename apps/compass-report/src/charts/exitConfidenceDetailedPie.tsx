import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ExitConfidenceNames, QuestionAreaNames } from '../enums';
import { useRef, useState, useEffect } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';
import { wrapText } from '../utilities';

function calculateChartData(exitConfidenceData: { [key: string]: string[] }): any[] {
  return Object.entries(exitConfidenceData).map(([key, values]) => {
    const shortName = key.split(':')[0];

    return {
      name: shortName,
      completelySure: values.filter(val => val === ExitConfidenceNames.CompletelySure).length,
      fairlySure: values.filter(val => val === ExitConfidenceNames.FairlySure).length,
      slightlyUnsure: values.filter(val => val === ExitConfidenceNames.SlightlyUnsure).length,
      completelyUnsure: values.filter(val => val === ExitConfidenceNames.CompletelyUnsure).length,
    };
  });
}

interface ExitConfidencePieChartProps {
  areaName: QuestionAreaNames;
}

// Add new type for pie data
type PieDataItem = {
  name: string;
  value: number;
  color: string;
};

export function ExitConfidenceDetailedPieChart({ areaName }: ExitConfidencePieChartProps) {
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center w-full mt-[-30px]">
      <div className="w-full flex justify-between items-center mb-0">
        <div className="ml-auto">
          <DownloadButton chartRef={chartRef} />
        </div>
      </div>
      <div className="p-6" style={{ 
        width: '100%', 
        height: Math.ceil(confidenceData.length / 4) * 200 + 120 // Increased row height to 250px and padding to 150px
      }} ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {confidenceData.map((entry, index) => {
              const pieData: PieDataItem[] = [
                { name: 'Completely Sure', value: entry.completelySure, color: colors['Completely sure'] },
                { name: 'Fairly Sure', value: entry.fairlySure, color: colors['Fairly sure'] },
                { name: 'Slightly Unsure', value: entry.slightlyUnsure, color: colors['Slightly unsure'] },
                { name: 'Completely Unsure', value: entry.completelyUnsure, color: colors['Completely unsure'] },
              ];

              const pieRadius = 80;
              const piesPerRow = 4;
              const xOffset = (index % piesPerRow) * 200 + 110;
              const yOffset = Math.floor(index / piesPerRow) * 250 + 120;

              return (
                <>
                  {(() => {
                    const lines = wrapText(entry.name);
                    const totalHeight = lines.length * 20; // 20px per line
                    
                    return lines.map((line, lineIndex) => (
                      <text
                        key={`${entry.name}-line-${lineIndex}`}
                        x={xOffset}
                        y={yOffset - 80 - (totalHeight - (lineIndex * 20))} // Position from bottom up
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        className="text"
                      >
                        {line}
                      </text>
                    ));
                  })()}
                  <Pie
                    key={entry.name}
                    data={pieData}
                    cx={xOffset}
                    cy={yOffset}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={pieRadius}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((item, idx) => (
                      <Cell key={`cell-${idx}`} fill={item.color} />
                    ))}
                  </Pie>
                </>
              );
            })}
            <Tooltip />
            {/* <Legend /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExitConfidenceDetailedPieChart;

