import { makeAutoObservable, runInAction } from "mobx";
import { searchMovies } from "../api/kinopoisk";
import type { Movie } from "../types/Movie";

class MovieStore {
  movies: Movie[] = [];
  isLoading = false;
  error: string | null = null;
  query = "Matrix";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await searchMovies(this.query);
      runInAction(() => {
        this.movies = response.data.docs;
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
}

const movieStore = new MovieStore();
export default movieStore;
