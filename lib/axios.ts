import axios from 'axios';

const api = axios.create({
  baseURL: 'http://oppa-recipe-env.eba-g2dvjrvz.ap-northeast-2.elasticbeanstalk.com', 
  timeout: 10000,
});

export default api;