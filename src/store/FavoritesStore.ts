import { makeAutoObservable } from "mobx";
import type { Movie } from "../types/Movie";

class FavoritesStore {
  favorites: Movie[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  add(movie: Movie) {
    if (!this.isFavorite(movie.id)) {
      this.favorites.push(movie);
      this.saveToStorage();
    }
  }

  remove(movieId: number) {
    this.favorites = this.favorites.filter((m) => m.id !== movieId);
    this.saveToStorage();
  }

  isFavorite(movieId: number) {
    return this.favorites.some((m) => m.id === movieId);
  }

  saveToStorage() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  loadFromStorage() {
    const data = localStorage.getItem("favorites");
    if (data) {
      try {
        this.favorites = JSON.parse(data);
      } catch {}
    }
  }
}

const favoritesStore = new FavoritesStore();
export default favoritesStore; 