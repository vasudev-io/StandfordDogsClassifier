import { DataFetchServiceAPI } from './DataFetchServiceAPI';

class BackendDataFetchService implements DataFetchServiceAPI {
  dataset: { [fieldNames: string]: any[] } = {};

  constructor() {
    this.fetchCSVData().then(res => this.dataset = res.data);
  }

  private async checkData(): Promise<boolean> {
    const checkDataExists = () => Object.keys(this.dataset).length > 0;
    if (checkDataExists()) return new Promise(res => res(true));
    return new Promise((res, rej) => {
      // Fetch every 100ms until the data exists
      const invervalID = setInterval(() => {
        if(checkDataExists()) {
          clearInterval(invervalID);
          res(true);
        }
      }, 100);
    })
  }

  private async fetchCSVData(): 
  Promise<{ data: { [fieldName: string]: any } }> {
    return fetch(`api/v1/data`)
    .then(res => res.json())
    .then(results => {
      return { data: results.data };
    });
  }

  async getStatistics(): Promise<{ accuracy: number; error: number; samples: number; } | Error> {
    await this.checkData();
    return { accuracy: 0.0, error: 0.0, samples: 0 };
  }

  async getClassifications(): Promise<{ [classname: string]: { correct: number, incorrect: number }}> {
    await this.checkData();

    const result: { [classname: string]: { correct: number, incorrect: number }} = {};

    return result;
  }
}

const backendDataFetchService = new BackendDataFetchService();
export default backendDataFetchService;
