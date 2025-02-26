import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, LabelList } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { colors } from './colors';
import { DownloadButton } from '../components/downloadButton';

function calculateChartData(educationPreferencesData: { [option: string]: number }): any[] {
  // Transform the object into an array of data points
  // Sort by preference (lower number = higher preference)
  return Object.entries(educationPreferencesData)
    .map(([option, averageRank]) => ({
      option,
      averageRank,
      // For visualization, we can use an inverse score to show higher bars for better rankings
      // Since 1 is best and 6 is worst, we can do 7-rank to get a "preference score"
      preferenceScore: Number((7 - averageRank).toFixed(2))
    }))
    .sort((a, b) => a.averageRank - b.averageRank); // Sort by rank (ascending)
}

export function EducationPreferenceChart() {
  const assessmentStore = useAssessmentStore();
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (assessmentStore.transformedData.length > 0) {
      const educationPreferencesData = assessmentStore.getEducationPreferenceRankings();
      const calculatedData = calculateChartData(educationPreferencesData);
      console.log('Education Preferences Data:', educationPreferencesData);
      console.log('Calculated Data:', calculatedData);
      setChartData(calculatedData);
    }
  }, [assessmentStore.transformedData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reported Preferred Learning Formats</h1>
        <DownloadButton chartRef={chartRef} />
      </div>
      <div className="text-sm text-gray-600 mb-4 text-center">
        <p>Average ranking from 1 (most preferred) to 6 (least preferred)</p>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer>
          <BarChart 
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 100, left: 0, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 6]}
              axisLine={{ stroke: '#E0E0E0' }}
              tickLine={{ stroke: '#E0E0E0' }}
            />
            <YAxis 
              type="category" 
              dataKey="option" 
              width={400}
              tick={{ fontSize: 13 }}
              axisLine={{ stroke: '#E0E0E0' }}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'preferenceScore') {
                  return [`${value} (higher is better)`, 'Preference Score'];
                }
                if (name === 'averageRank') {
                  return [`${value} (lower is better)`, 'Average Rank'];
                }
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="preferenceScore" 
              name="Preference Score" 
              fill={colors.confidenceBar} 
              barSize={40}
            >
              <LabelList 
                dataKey="averageRank" 
                position="right"
                formatter={(value: number) => `Average rank: ${value.toFixed(2)}`}
                style={{
                  fontSize: '13px',
                  fill: '#3d3d3d',
                  fontWeight: 600
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-600 mt-4 text-center w-full">
        <p>Rank your selection in order of preference with (1) being most preferred and (6) being least preferred. In which of the following formats do you prefer to receive professional continuing education about market access
        subjects? (1=most preferred and 6=least preferred)</p>
      </div>
    </div>
  );
}

export default EducationPreferenceChart; 