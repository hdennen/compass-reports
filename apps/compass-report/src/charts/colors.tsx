import { ExitConfidenceNames } from "../enums";

export const colors = {
  actualKnowledgeBar: '#D4AF37',
  actualKnowledgeAreaFill: 'rgba(255,205,86,.5)',
  actualKnowledgeAreaStroke: '#D3B039',
  exitConfidenceBar: '#82ca9d',
  confidenceBar: '#2D78C0',
  [ExitConfidenceNames.CompletelyUnsure]: '#AE3D3D',
  [ExitConfidenceNames.SlightlyUnsure]: '#E3ABAB',
  [ExitConfidenceNames.FairlySure]: '#82CA9D',
  [ExitConfidenceNames.CompletelySure]: '#3DAE67',
  legendText: '#000',
  veryLimited: '#545962',
  foundational: '#3473C1',
  advanced:     '#59A431',
  expert:     '#417A28'
}