import axios from 'axios';
const BASE_URL = "http://foodvise.com:3002"


export async function getShortenUrl(url) {
  let headers = {};
  return await axios.post(
    BASE_URL,
    {
      url
    }, {
      headers
    }
  );
}

export async function getFullUrl(url) {
  return await axios.get(`${BASE_URL}/${url}`);
}