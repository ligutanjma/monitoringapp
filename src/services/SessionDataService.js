import axios from 'axios';
const CancelToken = axios.CancelToken
let cancel;
// const URL = 'https://shielded-fjord-98167.herokuapp.com/'
// const URL = 'http://192.168.1.8:8000/'
const URL = 'http://0.0.0.0:8000/api/' // API server domain

class SessionDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getCurrent(headers) {
      return axios.get(`${URL}api/sessions/current/`, headers);
    }
    getStarted(headers) {
      return axios.get(`${URL}api/sessions/started/`, headers);

    }

    getAll(headers) {
      return axios.get(`${URL}api/sessions/`, headers);
    }
  
    get(id) {
      return axios.get(`${URL}api/sessions/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`${URL}api/sessions/`, data, headers);
    }
  
    update(id, data, headers) {
      return axios.patch(`${URL}api/sessions/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`${URL}api/sessions/${id}/`);
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
  
  export default new SessionDataService();