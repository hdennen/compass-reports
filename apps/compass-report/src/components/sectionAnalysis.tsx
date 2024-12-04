import { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useResponseStore } from '../store/responseStore';

interface SectionAnalysisProps {
  sectionQuestions: string[];
  sectionName: string;
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


export function SectionAnalysis({ sectionQuestions, sectionName }: SectionAnalysisProps) {
  const { transformedData: responseData } = useResponseStore();
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [overallCorrect, setOverallCorrect] = useState<number>(0);
  const [belowSeventyQuestions, setBelowSeventyQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (responseData.length > 0) {
      const { totalCorrect, totalScore, questionsBelow70 } = calculateScores(sectionQuestions, responseData);

      setOverallCorrect(totalScore > 0 ? (totalCorrect / totalScore) * 100 : 0);
      setConfidenceScore(totalScore > 0 ? (totalCorrect / totalScore) * 100 : 0);
      setBelowSeventyQuestions(questionsBelow70);
      setConfidenceScore(confidenceScore);

    }
  }, [responseData, sectionQuestions]);

  return (
    <div className="section-analysis">
      <h2>{sectionName}</h2>
      <p>Confidence (Pre): {confidenceScore}</p>
      <p>Overall Correct: {overallCorrect.toFixed(2)}%</p>
      <h3>Questions Scored Below 70%:</h3>
      <ul>
        {belowSeventyQuestions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
};

export default SectionAnalysis;
