import axios from 'axios';
const CancelToken = axios.CancelToken
let cancel;
const URL = 'https://shielded-fjord-98167.herokuapp.com'
// const URL = 'http://192.168.1.8:8000'
// const URL = 'http://127.0.0.1:8000' // API server domain
class UserDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getAll(headers) {
      return axios.get(`${URL}/api/users/`, headers);
    }
  
    get(id) {
      return axios.get(`${URL}/api/users/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`${URL}/api/users/`, data, headers);
    }
  
    patch(id, data, headers) {
      return axios.patch(`${URL}/api/users/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`${URL}/api/users/${id}/`);
    }
    filter(start,end, headers) {
      return axios.get(`${URL}/api/users/filtered/${start}/${end}/`, headers);

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