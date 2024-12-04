import { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useResponseStore } from '../store/responseStore';
import { ConfidenceLevel } from '../enums';

interface SectionAnalysisProps {
  sectionQuestions: string[];
  sectionName: string;
  sectionKey: string;
}

function calculateScores(sectionQuestions: string[], responseData: any[]) {
  let totalCorrect = 0;
  let totalScore = 0;
  const questionsBelow70: string[] = [];

  sectionQuestions.forEach(questionKey => {
    let questionTotalPointsAwarded = 0;
    let questionTotalPointsAvailable = 0;

    responseData.forEach(respondent => {
      const response = respondent[questionKey];
      if (response && response.Points) {
        const [pointsAwardedStr, pointsAvailableStr] = response.Points.toString().split('/');
        const pointsAwarded = parseFloat(pointsAwardedStr);
        const pointsAvailable = parseFloat(pointsAvailableStr);

        if (!isNaN(pointsAwarded) && !isNaN(pointsAvailable) && pointsAvailable > 0) {
          totalCorrect += pointsAwarded;
          totalScore += pointsAvailable;
          questionTotalPointsAwarded += pointsAwarded;
          questionTotalPointsAvailable += pointsAvailable;
        }
      }
    });


    const percentageScore = (questionTotalPointsAwarded / questionTotalPointsAvailable) * 100;
    if (percentageScore < 70) {
      questionsBelow70.push(questionKey);
    }
  });

  return { totalCorrect, totalScore, questionsBelow70 };
}


export function SectionAnalysis({ sectionQuestions, sectionName, sectionKey }: SectionAnalysisProps) {
  const { transformedData: responseData } = useResponseStore();
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [overallCorrect, setOverallCorrect] = useState<number>(0);
  const [belowSeventyQuestions, setBelowSeventyQuestions] = useState<string[]>([]);
  const assessmentStore = useAssessmentStore();
  useEffect(() => {
    if (responseData.length > 0) {
      const { totalCorrect, totalScore, questionsBelow70 } = calculateScores(sectionQuestions, responseData);
      const confidenceData = assessmentStore.getConfidenceData();
      const totalConfidence = confidenceData[sectionKey].reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
      const averageConfidence = totalConfidence / confidenceData[sectionKey].length;
      
      const belowSeventyQuestions = questionsBelow70.map(question => responseData[0][question].questionText);

      setOverallCorrect(totalScore > 0 ? (totalCorrect / totalScore) * 100 : 0);
      setConfidenceScore(averageConfidence);
      setBelowSeventyQuestions(belowSeventyQuestions as string[]);

    }
  }, [responseData, sectionQuestions]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="section-analysis p-4 mx-auto">
        <h2 className="text-2xl font-bold mb-4">{sectionName}</h2>
        <p className="text-lg mb-2">
          <strong>Confidence (pre):</strong> {confidenceScore.toFixed(2)}%
        </p>
        <p className="text-lg mb-4">
          <strong>Overall Correct:</strong> {overallCorrect.toFixed(2)}%
        </p>
        <h3 className="text-xl font-semibold mb-2">Most missed questions (below 70% Correct):</h3>
        <ul className="list-disc pl-5">
          {belowSeventyQuestions.map((question, index) => (
            <li key={index} className="mb-2">{question}</li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default SectionAnalysis;
