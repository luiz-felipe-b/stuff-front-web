import axios from 'axios';

// Lembre de passar o endpoint no .env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STUFF_API,
});

export default api;