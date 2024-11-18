import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:7000/api/v1', //Backend URL
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or dispatch a logout action
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);