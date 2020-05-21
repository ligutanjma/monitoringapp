import axios from 'axios';
const CancelToken = axios.CancelToken
let cancel;
const URL = '192.168.1.9'
class SessionDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getCurrent(headers) {
      return axios.get(`http://${URL}:8000/api/sessions/current/`, headers);
    }
    getStarted(headers) {
      return axios.get(`http://${URL}:8000/api/sessions/started/`, headers);

    }

    getAll(headers) {
      return axios.get(`http://${URL}:8000/api/sessions/`, headers);
    }
  
    get(id) {
      return axios.get(`http://${URL}:8000/api/sessions/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`http://${URL}:8000/api/sessions/`, data, headers);
    }
  
    update(id, data, headers) {
      return axios.put(`http://${URL}:8000/api/sessions/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`http://${URL}:8000/api/sessions/${id}/`);
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