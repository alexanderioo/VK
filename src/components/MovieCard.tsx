import { Link } from "react-router-dom";
import type { Movie } from "../types/Movie";
import styles from "./MovieCard.module.css";

interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.link}>
      <div className={styles.card}>
        {movie.poster?.previewUrl && (
          <img
            src={movie.poster.previewUrl}
            alt={movie.name}
            className={styles.image}
          />
        )}
        <h3 className={styles.title}>{movie.name}</h3>
        <p className={styles.year}>{movie.year}</p>
        {movie.rating?.kp !== undefined && (
          <p className={styles.rating}>Рейтинг: {movie.rating.kp}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
