import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor (optional)
axios.interceptors.request.use(
  (config) => {
    // You can modify the config before the request is sent
    // For example, you could add authentication tokens here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    } else {
      // Something happened in setting up the request that triggered an Error
    }

    // Optionally, you could handle specific status codes here
    if (error.response && error.response.status === 401) {
      // handle unauthorized error, e.g., redirect to login
    }

    // Always return a rejected promise so that the calling code can handle the error too
    return Promise.reject(error);
  }
);

export default axios;
