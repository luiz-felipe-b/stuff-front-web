import axios from 'axios';

// Lembre de passar o endpoint no .env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STUFF_API || "https://stuff-back.fly.dev/"
});

export default api;