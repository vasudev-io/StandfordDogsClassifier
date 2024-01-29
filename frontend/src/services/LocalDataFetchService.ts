// Import the csv from assets
import { parse } from 'papaparse';
import { DataFetchServiceAPI } from './DataFetchServiceAPI';

class LocalDataFetchService implements DataFetchServiceAPI {
  dataset: { [fieldNames: string]: any[] } = {};

  constructor() {
    this.fetchCSVData().then(res => this.dataset = res.data);
  }

  private async checkData(): Promise<boolean> {
    const checkDataExists = () => Object.keys(this.dataset).length > 0;
    if (checkDataExists()) return new Promise(res => res(true));
    return new Promise((res, rej) => {
      const invervalID = setInterval(() => {
        if(checkDataExists()) {
          clearInterval(invervalID);
          res(true);
        }
      }, 100);
    })
  }

  private async fetchCSVData(filename: string = 'stanford_dogs.csv'): 
  Promise<{ data: { [fieldName: string]: any }, errors: any[], meta: any }> {
    return fetch(`${process.env.PUBLIC_URL}/data/${filename}`)
    .then(res => res.text())
    .then(csvString => {
      const results = parse(csvString, {
        header: true, 
        dynamicTyping: true,
      });

      const reformattedData: { [fieldName: string]: any[] } = {};
      results.data
      .forEach((row: any) => Object.keys(row)
      .forEach(fieldName => {
        if (reformattedData[fieldName] === undefined) reformattedData[fieldName] = [];
        reformattedData[fieldName].push(row[fieldName]);
      }));

      return { data: reformattedData, errors: results.errors, meta: results.meta };
    });
  }

  async getStatistics(): Promise<{ accuracy: number; error: number; samples: number; } | Error> {
    await this.checkData();
    
    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';

    let correctEntries = 0;
    let wrongEntries = 0;

    for (let i = 0; i < this.dataset[labelField].length; i++) {
      if (this.dataset[labelField][i] === this.dataset[predictionField][i]) {
        correctEntries++;
      } else {
        wrongEntries++;
      }
    }

    const total = correctEntries + wrongEntries;
    return { accuracy: correctEntries / total, error: wrongEntries / total, samples: total };
  }

  async getClassifications(): Promise<{ [classname: string]: { correct: number, incorrect: number }}> {
    await this.checkData();

    const result: { [classname: string]: { correct: number, incorrect: number }} = {};

    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';

    for (let i = 0; i < this.dataset[labelField].length; i++) {
      const currentLabel = this.dataset[labelField][i];
      const currentPred = this.dataset[predictionField][i];
      if (result[currentLabel] === undefined) result[currentLabel] = { correct: 0, incorrect: 0 }
      if (currentLabel === currentPred) result[currentLabel].correct += 1;
      else result[currentLabel].incorrect += 1;
    }

    return result;
  }
  
  async getConfusionMatrix(): Promise<{ [actualLabel: string]: { [predictedLabel: string]: number } }> {
    await this.checkData();

    const result: { [actualLabel: string]: { [predictedLabel: string]: number } } = {};

    // Field Names
    const labelField = 'Labels';
    const predictionField = 'Predictions';

    for (let i = 0; i < this.dataset[labelField].length; i++) {
        const actualLabel = this.dataset[labelField][i];
        const predictedLabel = this.dataset[predictionField][i];

        if (!result[actualLabel]) {
            result[actualLabel] = {};
        }

        if (!result[actualLabel][predictedLabel]) {
            result[actualLabel][predictedLabel] = 0;
        }

        result[actualLabel][predictedLabel] += 1;
    }

    return result;

  }

  async getSensitivityScores(): Promise<{ [className: string]: number }> {
    await this.checkData();
  
    // Field Names
    const labelField = 'Labels';
    const errorsField = 'Errors';
  
    const classCounts: { [className: string]: { truePositive: number, falseNegative: number } } = {};
    
    // Initialize counters for each class
    this.dataset[labelField].forEach(label => {
      if (!classCounts[label]) {
        classCounts[label] = { truePositive: 0, falseNegative: 0 };
      }
    });
  
    // Count true positives and false negatives for each class based on errors
    for (let i = 0; i < this.dataset[labelField].length; i++) {
      const actualLabel = this.dataset[labelField][i];
      
      const error = this.dataset[errorsField][i];
  
      if (error === 'Correct') {
        // If it's correct, it's a true positive
        classCounts[actualLabel].truePositive++;
      } else {
        // If it's an error (not correct), it's a false negative
        classCounts[actualLabel].falseNegative++;
      }
    }
  
    // Calculate sensitivity for each class
    const sensitivityScores: { [className: string]: number } = {};
    Object.keys(classCounts).forEach(className => {
      const { truePositive, falseNegative } = classCounts[className];
      sensitivityScores[className] = truePositive / (truePositive + falseNegative);
    });
  
    return sensitivityScores;
  }
  
}


const localDataFetchService = new LocalDataFetchService();
export default localDataFetchService;
