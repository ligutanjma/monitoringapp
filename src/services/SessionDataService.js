import axios from 'axios';
const CancelToken = axios.CancelToken
let cancel;
const URL = 'shielded-fjord-98167.herokuapp.com/'
class SessionDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getCurrent(headers) {
      return axios.get(`http://${URL}api/sessions/current/`, headers);
    }
    getStarted(headers) {
      return axios.get(`http://${URL}api/sessions/started/`, headers);

    }

    getAll(headers) {
      return axios.get(`http://${URL}api/sessions/`, headers);
    }
  
    get(id) {
      return axios.get(`http://${URL}api/sessions/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`http://${URL}api/sessions/`, data, headers);
    }
  
    update(id, data, headers) {
      return axios.put(`http://${URL}api/sessions/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`http://${URL}api/sessions/${id}/`);
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