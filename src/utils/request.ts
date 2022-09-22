import axios from 'axios';
import {getCredentials} from './login';

export const reqConfig = {
  url: 'http://34.220.173.157:7001',
  // url: 'http://127.0.0.1:7001',
};

export const get = (path: string) => {
  console.log('reqConfig.url:', reqConfig.url);
  return axios.get(reqConfig.url + path, {
    headers: {
      ...getCredentials(),
    },
    timeout: 10 * 1000
  });
};

export const post = (path: string, param: Record<string, string | number>) => {
  return axios.post(reqConfig.url + path, param, {
    headers: {
      ...getCredentials(),
    },
    timeout: 10 * 1000
  });
};

axios.interceptors.response.use(undefined, function(error){
  if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1){
    alert('Your network is slow now, please check it.');
  }
});
