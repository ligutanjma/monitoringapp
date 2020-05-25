import axios from 'axios';
const CancelToken = axios.CancelToken
let cancel;
const URL = 'https://shielded-fjord-98167.herokuapp.com'
class SessionDataService {
    state = {
      cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      cancel = c;
    })
  }
    
    

    // getAll(headers) {
    //   return axios.get(`http://${URL}:8000/api/customers/`, headers);
    // }
  
    // get(id) {
    //   return axios.get(`http://${URL}:8000/api/customers/${id}`);
    // }
  
    // create(data, headers) {
    //   return axios.post(`http://${URL}:8000/api/customers/`, data, headers);
    // }
  
    // patch(id, data, headers) {
    //   return axios.patch(`http://${URL}:8000/api/customers/${id}/`, data, headers);
    // }
  
    // delete(id) {
    //   return axios.delete(`http://${URL}:8000/api/customers/${id}/`);
    // }
    getAll(headers) {
      return axios.get(`${URL}/api/customers/`, headers);
    }
  
    get(id) {
      return axios.get(`${URL}/api/customers/${id}`);
    }
  
    create(data, headers) {
      return axios.post(`${URL}/api/customers/`, data, headers);
    }
  
    patch(id, data, headers) {
      return axios.patch(`${URL}/api/customers/${id}/`, data, headers);
    }
  
    delete(id) {
      return axios.delete(`${URL}/api/customers/${id}/`);
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