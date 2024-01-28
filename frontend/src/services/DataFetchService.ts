import { DataFetchServiceAPI } from './DataFetchServiceAPI';
import localDataFetchService from './LocalDataFetchService';
import backendDataFetchService from './BackendDataFetchService';

// Change the source here to the backend when the APIs are ready
let SOURCE: 'LOCAL' | 'BACKEND' = 'LOCAL';

const dataFetchService: () => DataFetchServiceAPI = () => {
    if (SOURCE === 'BACKEND') return backendDataFetchService;
    else return localDataFetchService;
}

export default dataFetchService();
