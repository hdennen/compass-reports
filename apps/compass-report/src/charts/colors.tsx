import { ExitConfidenceNames } from "../enums";

export const colors = {
  actualKnowledgeBar: '#ffe5a9',
  actualKnowledgeAreaFill: 'rgba(255,205,86,.5)',
  actualKnowledgeAreaStroke: '#ffe5a9',
  exitConfidenceBar: '#82ca9d',
  confidenceBar: '#8db1d3',
  [ExitConfidenceNames.CompletelyUnsure]: '#E14B4B',
  [ExitConfidenceNames.SlightlyUnsure]: '#F59B9B',
  [ExitConfidenceNames.FairlySure]: '#AEF59B',
  [ExitConfidenceNames.CompletelySure]: '#29BF00',
  legendText: '#000',
  veryLimited: 'rgb(236, 236, 243)',
  foundational: 'rgb(204, 216, 232)',
  advanced: 'rgb(173, 196, 222)',
  expert: 'rgb(141, 177, 211)'
}