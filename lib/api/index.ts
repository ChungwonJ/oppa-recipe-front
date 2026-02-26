import axios from 'axios';
import { requestInterceptor, responseErrorInterceptor } from './interceptors';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => responseErrorInterceptor(error, api) 
);

export default api;