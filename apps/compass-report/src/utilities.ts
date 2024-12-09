import { ExitConfidenceKeys, ExitConfidenceNames, QuestionAreaKeys, QuestionAreaNames } from "./enums";

export function getDisplayName(sectionKey: string): string {
  const areaKey = Object.keys(QuestionAreaKeys).find(
    key => QuestionAreaKeys[key as keyof typeof QuestionAreaKeys] === sectionKey
  );
  const displayName = areaKey ? QuestionAreaNames[areaKey as keyof typeof QuestionAreaNames] : sectionKey;
  return displayName;
}

export function getDisplayNameForExitConfidence(exitConfidenceKeyQuestion: string): string {
  const areaKey = Object.keys(ExitConfidenceKeys).find(
    key => ExitConfidenceKeys[key as keyof typeof ExitConfidenceKeys] === exitConfidenceKeyQuestion
  );
  const displayName = areaKey ? QuestionAreaNames[areaKey as keyof typeof QuestionAreaNames] : exitConfidenceKeyQuestion;
  return displayName;
}
