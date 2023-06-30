import axios from "axios";

const http = axios.create({
  baseURL: `https://www.wrike.com/api/v4/`,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:8081/",
    "Access-Control-Allow-Headers": "Origin, Authorization",
    // "Access-Control-Allow-Credentials": false,
    Authorization:
      "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODQxNDU3NixcImNcIjo0NjM1ODE0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NjYyNTUzMDh9.8OCwkj8xXpvsAsky9zoKn-vjKDmtYBT3rQ3UTIEX6yw",
  },
});

export default http;
