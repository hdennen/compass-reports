import { ExitConfidenceNames } from "../enums";

export const colors = {
  actualKnowledgeBar: '#ffe5a9',
  actualKnowledgeAreaFill: 'rgba(255,205,86,.5)',
  actualKnowledgeAreaStroke: '#ffe5a9',
  exitConfidenceBar: '#82ca9d',
  confidenceBar: '#8db1d3',
  [ExitConfidenceNames.CompletelyUnsure]: '#ff7373',
  [ExitConfidenceNames.SlightlyUnsure]: '#ffe5a9',
  [ExitConfidenceNames.FairlySure]: '#82ca9d',
  [ExitConfidenceNames.CompletelySure]: '#8db1d3',
  legendText: '#000'
}
