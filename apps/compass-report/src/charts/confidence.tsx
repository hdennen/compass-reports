import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { dataEntry } from '../types';
import { ConfidenceLevel, QuestionAreaKeys, QuestionAreaNames } from '../enums';
import { C1SectionQuestions } from '../data';
import { useAssessmentStore } from '../store/assessmentStore';
import { useResponseStore } from '../store/responseStore';

const areaDot = {stroke: '#ffe5a9', strokeWidth: 2, fill: 'white', r: 5};

function calculateActualKnowledge(responseData: dataEntry<dataEntry>[]): {[key: string]: number} {
  const actualKnowledgeData: {[key: string]: number} = {};

  Object.keys(C1SectionQuestions).forEach(section => {
    let totalPointsAwarded = 0;
    let totalPointsAvailable = 0;
    let scoreCount = 0;
  
    C1SectionQuestions[section as keyof typeof C1SectionQuestions].forEach(questionKey => {
      responseData.forEach(respondent => {
        const responseData = respondent[questionKey];
        if (responseData && responseData.Points) {
          const [pointsAwardedStr, pointsAvailableStr] = responseData.Points.toString().split('/');
          const pointsAwarded = parseFloat(pointsAwardedStr);
          const pointsAvailable = parseFloat(pointsAvailableStr);
  
          if (!isNaN(pointsAwarded) && !isNaN(pointsAvailable) && pointsAvailable > 0) {
            scoreCount++;
            totalPointsAwarded += pointsAwarded;
            totalPointsAvailable += pointsAvailable;
          }
        }
      });
    });

    actualKnowledgeData[section] = scoreCount > 0 ? (totalPointsAwarded / totalPointsAvailable) * 100 : 0;
  })

  return actualKnowledgeData;
}

function calculateChartData(responseData: dataEntry<dataEntry>[], confidenceData: {[key: string]: ConfidenceLevel[]}): any[] {
  const actualKnowledgeData = calculateActualKnowledge(responseData);

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([name, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;

    const actualAverage = actualKnowledgeData[name as keyof typeof actualKnowledgeData];

    // First find the key in QuestionAreaKeys by its value
    const areaKey = Object.keys(QuestionAreaKeys).find(
      key => QuestionAreaKeys[key as keyof typeof QuestionAreaKeys] === name
    );
    // Then use that key to get the display name from QuestionAreaNames
    const displayName = areaKey ? QuestionAreaNames[areaKey as keyof typeof QuestionAreaNames] : name;


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

  useEffect(() => {
    if (assessmentStore.transformedData.length > 0) {
      console.log('Confidence Chart Data has been updated:', assessmentStore.transformedData);
      const confidenceData = assessmentStore.getConfidenceData();
      const calculatedData = calculateChartData(responseStore.transformedData, confidenceData);
      setChartData(calculatedData);
    }
  }, [assessmentStore.transformedData, responseStore.transformedData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confidence Comparison</h1>
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
                color: '#ffb700',  // This controls the icon color
              },
              {
                value: 'Confidence',
                type: 'rect',
                color: '#8db1d3',  // This controls the icon color
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
            fill="rgba(255,205,86,.5)" 
            stroke="#ffe5a9" 
          />
          <Bar 
            dataKey="averageConfidence"
            yAxisId="right"
            name="Confidence" 
            barSize={40} 
            fill="#8db1d3"
          />
        </ComposedChart>
      </div>
    </div>
  );
}

export default ConfidenceChart;
