import axios from "axios";

const request = axios.create();

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response || { data: {} });
  }
);
const api = (options = {}) => {
  return request(options);
};
module.exports = api;
