import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

// Define custom colors for interest levels
const interestColors = {
  'Not interested': '#A9A9A9',     // Gray
  'Somewhat interested': '#F4964B', // Orange
  'Very interested': '#4A75D1'     // Blue
};

interface InterestCountData {
  contentArea: string;
  'Not interested': number;
  'Somewhat interested': number;
  'Very interested': number;
  'Not interested %': number;
  'Somewhat interested %': number;
  'Very interested %': number;
  total: number;
}

function calculateChartData(interestCounts: { [contentArea: string]: { [interestLevel: string]: number } }): InterestCountData[] {
  // Transform the nested object into an array suitable for the stacked bar chart
  return Object.entries(interestCounts).map(([contentArea, counts]) => {
    // Calculate total responses for this content area to determine percentages
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    // Create the data object with percentages
    return {
      contentArea,
      'Not interested': counts['Not interested'],
      'Somewhat interested': counts['Somewhat interested'],
      'Very interested': counts['Very interested'],
      // Add percentage values for tooltip
      'Not interested %': total > 0 ? Math.round((counts['Not interested'] / total) * 100) : 0,
      'Somewhat interested %': total > 0 ? Math.round((counts['Somewhat interested'] / total) * 100) : 0,
      'Very interested %': total > 0 ? Math.round((counts['Very interested'] / total) * 100) : 0,
      total
    };
  })
  // Sort by "Very interested" count (descending)
  .sort((a, b) => b['Very interested'] - a['Very interested']);
}

// Custom formatter for bar labels - only show values > 0
const valueFormatter = (value: number) => {
  return value > 0 ? value : '';
};

export function MarketAccessInterestChart() {
  const assessmentStore = useAssessmentStore();
  const [chartData, setChartData] = useState<InterestCountData[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (assessmentStore.transformedData.length > 0) {
      const interestCounts = assessmentStore.getMarketAccessInterestCounts();
      const calculatedData = calculateChartData(interestCounts);
      setChartData(calculatedData);
    }
  }, [assessmentStore.transformedData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Interest in Market Access Content Areas</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div className="text-sm text-gray-600 mb-4 text-center">
        <p>Assessment results and job responsibility aligned with areas of interest.</p>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 600 }}>
        <ResponsiveContainer>
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 20, right: 40, left: 10, bottom: 5 }}
            barSize={40}
            barGap={4}
          >
            <XAxis 
              type="number" 
              axisLine={{ stroke: '#E0E0E0' }}
              tickLine={false}
              tick={false}
              domain={[0, 'dataMax']}
            />
            <YAxis 
              type="category" 
              dataKey="contentArea" 
              width={400}
              tick={{ fontSize: 14 }}
              axisLine={{ stroke: '#E0E0E0' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name: string) => {
                // Display count and percentage in tooltip
                if (name.includes('%')) return [`${value}%`, name.replace(' %', '')];
                return [`${value} responses`, name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: 20,
                fontSize: 14 
              }}
            />
            <Bar 
              dataKey="Very interested" 
              stackId="a" 
              fill={interestColors['Very interested']}
              name="Very interested"
            >
              <LabelList 
                dataKey="Very interested" 
                position="center"
                style={{ 
                  fill: 'white', 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                }}
                formatter={valueFormatter}
              />
            </Bar>
            <Bar 
              dataKey="Somewhat interested" 
              stackId="a" 
              fill={interestColors['Somewhat interested']}
              name="Somewhat interested"
            >
              <LabelList 
                dataKey="Somewhat interested" 
                position="center"
                style={{ 
                  fill: 'white', 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                }}
                formatter={valueFormatter}
              />
            </Bar>
            <Bar 
              dataKey="Not interested" 
              stackId="a" 
              fill={interestColors['Not interested']}
              name="Not interested"
            >
              <LabelList 
                dataKey="Not interested" 
                position="center"
                style={{ 
                  fill: 'white', 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
                }}
                formatter={valueFormatter}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-sm text-gray-600 mt-6 text-center w-full max-w-3xl">
        <p>Q71. Market access is a complex and continually evolving landscape. We are committed to helping you stay current with changes that impact patient and provider access. Please rank your level of interest in developing deeper knowledge and better understanding for each of these content areas.</p>
      </div>
    </div>
  );
}

export default MarketAccessInterestChart; 