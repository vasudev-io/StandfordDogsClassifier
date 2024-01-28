export interface DataFetchServiceAPI {
  getClassifications(): Promise<{ [classname: string]: { correct: number, incorrect: number }}>;
  getStatistics(): Promise<{ accuracy: number; error: number; samples: number; } | Error>;
}
