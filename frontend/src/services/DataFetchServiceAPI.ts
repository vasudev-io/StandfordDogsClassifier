export interface DataFetchServiceAPI {
  getClassifications(): Promise<{ [classname: string]: { correct: number, incorrect: number } }>;
  getStatistics(): Promise<{ accuracy: number; error: number; samples: number; } | Error>;
  getConfusionMatrix(): Promise<{ [actualLabel: string]: { [predictedLabel: string]: number } }>;
  getSensitivityScores(): Promise<{ [classname: string]: number }>;
  
}


