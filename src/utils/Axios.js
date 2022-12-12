import axios from "axios";

const Axios = axios.create({
  baseURL:
    process.env.REACT_APP_AXIOS === "development"
      ? "http://localhost:3020/api"
      : "/api",
  timeout: 50000,
  withCredentials: true,
});

export default Axios;
