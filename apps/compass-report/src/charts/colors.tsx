import { ExitConfidenceNames } from "../enums";

export const colors = {
  actualKnowledgeBar: '#ffe5a9',
  actualKnowledgeAreaFill: 'rgba(255,205,86,.5)',
  actualKnowledgeAreaStroke: '#ffe5a9',
  exitConfidenceBar: '#82ca9d',
  confidenceBar: '#8db1d3',
  [ExitConfidenceNames.CompletelyUnsure]: '#AE3D3D',
  [ExitConfidenceNames.SlightlyUnsure]: '#E3ABAB',
  [ExitConfidenceNames.FairlySure]: '#82CA9D',
  [ExitConfidenceNames.CompletelySure]: '#3DAE67',
  legendText: '#000',
  veryLimited: '#91E9FF',
  foundational: '#00B7E5',
  advanced:     '#2D78C0',
  expert:     '#16416B'
}