import axios from "axios";
var url=localStorage.getItem('baseURL')
axios.defaults.baseURL = url;
axios.defaults.headers.common['Authorization'] = '';

export default function fetch(url, params) {

    axios.defaults.headers.common['Authorization'] = localStorage.token;
    if (params) {
    	
        return axios.post(url, params).catch(function(error) {
          if (error.response) {
              if (error.response.status == 401) {
                location.href = '#/user/login';
              }
          } else {
              console.log(error)
          }
      });
    }
    return axios.get(url).catch(function(error) {
    	
        if (error.response) {
            if (error.response.status == 401) {
              location.href = '#/user/login';
            }
        } else {
            console.log(error)
        }
    });
}