// const instance = axios.create({
//     baseURL: 'https://localhost:8000/',
//     timeout: 1000,
//     headers: {'X-Custom-Header': 'foobar'}
//   });
//   export default instance;
// require('dotenv').config()

// const BaseURL = "http://64.227.130.181:9002/"
// const BaseURL = "http://django.febinosolutions.com/"
// const BaseURL = "http://febinosolutions.com:9002/"
// const BaseURL = "https://productionb.univa.cloud/"
const BaseURL = "http://localhost:9020/"

// let BaseURL = process.env.REACT_APP_LOCAL_BASE_URL ? process.env.REACT_APP_LOCAL_BASE_URL : "http://localhost:9020";
// if(process.env.REACT_APP_ENV === 'production'){
//     BaseURL = process.env.REACT_APP_REMOTE_BASE_URL
// }else if(process.env.REACT_APP_ENV === 'development'){
//     BaseURL = process.env.REACT_APP_DEVELOPMENT_BASE_URL
// }


export default BaseURL