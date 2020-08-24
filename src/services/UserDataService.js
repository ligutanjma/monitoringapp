import axios from 'axios';
import {HOST_URL} from '../reusable/constants'
const CancelToken = axios.CancelToken
let cancel;

class UserDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getAll(headers) {
      return axios.get(`http://${HOST_URL}/api/users/`, headers);
    }
  
    get(id) {
      return axios.get(`http://${HOST_URL}/api/users/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`http://${HOST_URL}/api/users/`, data, headers);
    }
  
    patch(id, data, headers) {
      return axios.patch(`http://${HOST_URL}/api/users/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`http://${HOST_URL}/api/users/${id}/`);
    }
    filter(start,end, headers) {
      return axios.get(`http://${HOST_URL}/api/users/filtered/${start}/${end}/`, headers);

    }
    // deleteAll() {
    //   return axios.delete(`https://jsonplaceholder.typicode.com/users`);
    // }
  
    // findByTitle(title) {
    //   return axios.get(`/tutorials?title=${title}`);
    // }
    cancelToken() {
      cancel()
      
    }
  }
  
  export default new UserDataService();