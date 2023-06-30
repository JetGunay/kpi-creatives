import axios from "axios";

const http = axios.create({
  baseURL: `https://www.wrike.com/api/v4/`,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:8081/",
    "Access-Control-Allow-Headers": "Origin, Authorization",
    // "Access-Control-Allow-Credentials": false,
    Authorization:
      "Bearer "+token,
  },
});

export default http;
