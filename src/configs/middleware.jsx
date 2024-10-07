import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export const unAuthorized = () => {
  setTimeout(() => {
    window.localStorage.clear();
    window.location.reload();
  }, 1000);
};

let Count = 0;

const axiosInterceptorInstance = axios.create({
  baseURL: 'https://coreapi.hectorai.live/api/',
});

axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('TOKEN');
    const userIdentity = "U2FsdGVkX1/s3KYiwn1BdNtI1nNitQYbPVGs5G6NloO7PVGlCBTzYpJzAOD/8GaIp30IcvyKuBArXvm5xNN+gOhrSx51l49Ejxan4p7mt1vAUIE6/O277AUuMZVIMsmOtF5YGyaGkyDk9bMjArr3ekLdCKAZu9xXN/b92jqFqXb2jy4tbQbp8UUQxgywAWk1gR4dSb/vaJt4oEIeh0EWuEc4xU2NVdGSedANzYRqUEatsdtRYbNbdkZMt9koQcKO55/Y6fGafYUCztvkASn6i8WyPIxXMq6vf+xo4IYXeOh2WP8WgH/cQgq6V74Fnl82KYtUvGzWVMXpm2rrhsHewJptgJvJY+NinV05HdRJGtXQ1SN3/IhqyJZJhTb/TcO5SkDa8dIGfwgcciGspOofrA==" 

    if (accessToken) {
      if (config.headers) {
        config.headers['Authorization'] = `${accessToken}`;
       
      }
    } else {
      console.error("No access token found");
    }

    if (userIdentity) {
      config.headers['Authorization'] = `${accessToken}`;
      config.headers['X-USER-IDENTITY'] = userIdentity;
    } else {
      console.error("No X-USER-IDENTITY found");
    }

    console.log('Request Headers:', config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      console.error("401 Unauthorized: Check your token and headers.");
    }
    
    if (error?.response?.status === 403 && Count === 0) {
      toast.error('User Token Expired', { duration: 2000 });
      unAuthorized();
      Count = Count + 1;
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;
