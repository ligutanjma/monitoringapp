import decode from 'jwt-decode'
import axios from 'axios'
import {HOST_URL} from '../reusable/constants'
class AuthService {
    // Initializing important variables

    login (username, password){
        // Get a token from api server using the fetch api
        return axios.post(`http://${HOST_URL}/api/token/`, {
            "username": username,
            "password": password 
        },{headers: {'Content-Type': 'application/json'}})
    }

    loggedIn=()=> {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired=(token)=> {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken=(token)=> {
        // Saves user token to localStorage
        localStorage.setItem('token', token)
    }

    getToken=()=> {
        // Retrieves the user token from localStorage
        return localStorage.getItem('token')
    }

    logout=()=> {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getProfile=()=> {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch=(url, options)=> {
        // performs api calls sending the required authentication headers
        const headers = {
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'JWT ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus=(response)=> {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
export default new AuthService();