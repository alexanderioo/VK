import axios from "axios";

const API = axios.create({
  baseURL: "https://api.kinopoisk.dev",
  headers: {
    "X-API-KEY": import.meta.env.VITE_KINOPOISK_API_KEY,
  },
});

export const searchMovies = (query: string, page: number = 1, limit: number = 10) =>
  API.get("/v1.2/movie/search", { params: { query, page, limit } });
