import axios from 'axios';
import {HOST_URL} from '../reusable/constants'
const CancelToken = axios.CancelToken
let cancel;

class SessionDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    getCurrent(headers) {
      return axios.get(`http://${HOST_URL}/api/sessions/current/`, headers);
    }
    getStarted(headers) {
      return axios.get(`http://${HOST_URL}/api/sessions/started/`, headers);

    }

    getAll(headers) {
      return axios.get(`http://${HOST_URL}/api/sessions/`, headers);
    }
  
    get(id) {
      return axios.get(`http://${HOST_URL}/api/sessions/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`http://${HOST_URL}/api/sessions/`, data, headers);
    }
  
    update(id, data, headers) {
      return axios.patch(`http://${HOST_URL}/api/sessions/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`http://${HOST_URL}/api/sessions/${id}/`);
    }
    filter(start,end, headers) {
      return axios.get(`http://${HOST_URL}/api/sessions/filtered/${start}/${end}/`, headers);

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