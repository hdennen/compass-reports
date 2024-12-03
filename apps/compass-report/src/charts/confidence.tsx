import { ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, Bar } from 'recharts';
import { useEffect, useState } from 'react';
import { dataEntry } from '../types';
import { ConfidenceLevel } from '../enums';
import { C1SectionQuestions } from '../data';

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

function calculateConfidence(assessmentData: dataEntry<dataEntry>[], responseData: dataEntry<dataEntry>[]): any[] {
  const confidenceData: {[key: string]: ConfidenceLevel[]} = {};

  assessmentData.forEach(item => {
    Object.keys(item).forEach(key => {
      const value = item[key];

      if (typeof value === 'object' && value !== null && value.Response) {
        const confidenceLevel = value.Response;
        if (Object.values(ConfidenceLevel).includes(confidenceLevel as ConfidenceLevel)) {
          if (!confidenceData[key]) {
            confidenceData[key] = [];
          }
          confidenceData[key].push(confidenceLevel as ConfidenceLevel);
        }
      }
    });

  });

  const actualKnowledgeData = calculateActualKnowledge(responseData);

  // Transform the object into an array of data points
  return Object.entries(confidenceData).map(([name, values]) => {
    const totalConfidence = values.reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
    const averageConfidence = totalConfidence / values.length;

    const actualAverage = actualKnowledgeData[name as keyof typeof actualKnowledge];

    return {
      name,
      averageConfidence,
      actualAverage
    };
  });
}

export function ConfidenceChart({ assessmentData, responseData }: { assessmentData: dataEntry<dataEntry>[], responseData: dataEntry<dataEntry>[] }) {
  const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    if (assessmentData.length > 0) {
      console.log('Confidence Chart Data has been updated:', assessmentData);
      const calculatedData = calculateConfidence(assessmentData, responseData);
      setConfidenceData(calculatedData);
    }
  }, [assessmentData, responseData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confidence Comparison</h1>
      <ComposedChart width={900} height={450} data={confidenceData} barGap={20}>
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
        <Legend />
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
  );
}

export default ConfidenceChart;
