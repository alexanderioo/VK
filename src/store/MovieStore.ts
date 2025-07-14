import { makeAutoObservable, runInAction } from "mobx";
import { searchMovies } from "../api/kinopoisk";
import type { Movie } from "../types/Movie";

class MovieStore {
  movies: Movie[] = [];
  isLoading = false;
  error: string | null = null;
  query = "Matrix";
  filters = {
    yearRange: [1990, 2025] as [number, number],
    ratingRange: [0, 10] as [number, number],
    genres: [] as string[],
  };
  page = 1;
  limit = 50;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies(append = false) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await searchMovies(this.query, this.page, this.limit);
      let movies = response.data.docs;
      const { yearRange, ratingRange, genres } = this.filters;
      movies = movies.filter((movie: any) => {
        const yearOk = movie.year >= yearRange[0] && movie.year <= yearRange[1];
        const ratingOk = typeof movie.rating?.kp === 'number' ? (movie.rating.kp >= ratingRange[0] && movie.rating.kp <= ratingRange[1]) : true;
        const genresOk = !genres.length || (movie.genres && genres.some((g) => movie.genres.some((mg: any) => mg.name.toLowerCase() === g.toLowerCase())));
        return yearOk && ratingOk && genresOk;
      });
      runInAction(() => {
        if (append) {
          this.movies = [...this.movies, ...movies];
        } else {
          this.movies = movies;
        }
        this.isLoading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e.message ?? "Unknown error";
        this.isLoading = false;
      });
    }
  }

  loadNextPage() {
    this.page += 1;
    this.fetchMovies(true);
  }

  resetMovies() {
    this.page = 1;
    this.movies = [];
  }

  setQuery(q: string) {
    this.query = q;
    this.resetMovies();
  }

  setFilters(filters: { query: string; yearRange: [number, number]; ratingRange: [number, number]; genres: string[] }) {
    this.query = filters.query;
    this.filters = {
      yearRange: filters.yearRange,
      ratingRange: filters.ratingRange,
      genres: filters.genres
    };
    this.resetMovies();
  }
}

const movieStore = new MovieStore();
export default movieStore;
