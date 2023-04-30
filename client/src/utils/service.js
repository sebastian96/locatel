import axios from "axios";

const api_url = "http://localhost:4000/api/";

const fetch_data = async (method, endpoint, data = {}) => {
  const response = await axios({
    method: method,
    url: `${api_url}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  if (response.data.satus !== "error") {
    return response.data;
  }
};

export default fetch_data;
