import { makeAutoObservable, runInAction } from "mobx";
import { searchMovies } from "../api/kinopoisk";
import type { Movie } from "../types/Movie";

class MovieStore {
  movies: Movie[] = [];
  isLoading = false;
  error: string | null = null;
  query = "Matrix";
  filters = {
    yearRange: [1980, 2025] as [number, number],
    genre: ""
  };

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await searchMovies(this.query);
      let movies = response.data.docs;
      const { yearRange, genre } = this.filters;
      movies = movies.filter((movie: any) => {
        const yearOk = movie.year >= yearRange[0] && movie.year <= yearRange[1];
        const genreOk = !genre || (movie.genres && movie.genres.some((g: any) => g.name.toLowerCase() === genre.toLowerCase()));
        return yearOk && genreOk;
      });
      runInAction(() => {
        this.movies = movies;
        this.isLoading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message ?? "Unknown error";
        this.isLoading = false;
      });
    }
  }

  setQuery(q: string) {
    this.query = q;
  }

  setFilters(filters: { query: string; yearRange: [number, number]; genre: string }) {
    this.query = filters.query;
    this.filters = {
      yearRange: filters.yearRange,
      genre: filters.genre
    };
  }
}

const movieStore = new MovieStore();
export default movieStore;
