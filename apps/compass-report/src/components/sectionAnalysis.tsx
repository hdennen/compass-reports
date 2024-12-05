import { useEffect, useState } from 'react';
import { useAssessmentStore } from '../store/assessmentStore';
import { useResponseStore } from '../store/responseStore';
import { ConfidenceLevel } from '../enums';

interface SectionAnalysisProps {
  sectionQuestions: string[];
  sectionName: string;
  sectionKey: string;
}

function calculateScores(sectionQuestions: string[], responseData: any[], threshold: number) {
  let totalCorrect = 0;
  let totalScore = 0;
  const questionsBelowThreshold: string[] = [];

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
    if (percentageScore < threshold) {
      questionsBelowThreshold.push(questionKey);
    }
  });

  return { totalCorrect, totalScore, questionsBelowThreshold };
}

function calculateQuestionData(questionsBelowThreshold: string[], responseData: any[]) {
  return questionsBelowThreshold.map(question => {
    const points = responseData.reduce((acc, response) => {
      const [pointsAwardedStr, pointsAvailableStr] = response[question].Points.toString().split('/');
      acc.pointsAwarded += parseFloat(pointsAwardedStr);
      acc.pointsAvailable += parseFloat(pointsAvailableStr);
      return acc;
    }, { pointsAwarded: 0, pointsAvailable: 0 });

    return {
      question: responseData[0][question].questionText,
      pointsAwarded: points.pointsAwarded,
      pointsAvailable: points.pointsAvailable
    }
  });
}


export function SectionAnalysis({ sectionQuestions, sectionName, sectionKey }: SectionAnalysisProps) {
  const { transformedData: responseData, threshold } = useResponseStore();
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [overallCorrect, setOverallCorrect] = useState<number>(0);
  const [belowThresholdQuestions, setBelowSeventyQuestions] = useState<{question: string, pointsAwarded: number, pointsAvailable: number}[]>([]);
  const assessmentStore = useAssessmentStore();
  useEffect(() => {
    if (responseData.length > 0) {
      const { totalCorrect, totalScore, questionsBelowThreshold } = calculateScores(sectionQuestions, responseData, threshold);
      const confidenceData = assessmentStore.getConfidenceData();
      if (confidenceData[sectionKey]) {
        const totalConfidence = confidenceData[sectionKey].reduce((sum, val) => sum + ConfidenceLevel[val as keyof typeof ConfidenceLevel], 0);
        const averageConfidence = totalConfidence / confidenceData[sectionKey].length;
        setConfidenceScore(averageConfidence);
      }
      
      const belowThresholdQuestionsData = calculateQuestionData(questionsBelowThreshold, responseData);

      setOverallCorrect(totalScore > 0 ? (totalCorrect / totalScore) * 100 : 0);
      setBelowSeventyQuestions(belowThresholdQuestionsData);

    }
  }, [responseData, sectionQuestions, threshold]);

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
        <h3 className="text-xl font-semibold mb-2">Most missed questions (below {threshold}% Correct):</h3>
        <ul className="list-disc pl-5">
          {belowThresholdQuestions.map((question, index) => (
            <li key={index} className="mb-2">{question.question} ({question.pointsAwarded}/{question.pointsAvailable})</li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default SectionAnalysis;
