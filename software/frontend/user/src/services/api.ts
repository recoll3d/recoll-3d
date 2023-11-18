import axios from 'axios';
// const { REACT_APP_URL } = process.env;

export const api = axios.create({
  baseURL: 'http://localhost:3333'
});

api.interceptors.request.use(config => {
  console.log(config);

  return config;
});