import axios from 'axios';
// const { REACT_APP_URL } = process.env;

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(config => {
  console.log(config);

  return config;
});