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

export function wrapText(text: string, maxWidth: number = 18) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxWidth) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

export function truncateName(name: string, maxLength: number = 10) {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
}
