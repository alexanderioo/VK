import { Link } from "react-router-dom";
import type { Movie } from "../types/Movie";
import styles from "./MovieCard.module.css";

interface Props {
  movie: Movie;
}

const placeholderPoster = "https://via.placeholder.com/200x300?text=No+Image";

const MovieCard = ({ movie }: Props) => {
  const posterUrl = movie.poster?.previewUrl || movie.poster?.url || placeholderPoster;
  const title = movie.name || movie.alternativeName || movie.enName || "Нет названия";
  const year = movie.year || "Нет года";
  const rating =
    (typeof movie.rating?.kp === 'number' && movie.rating.kp > 0)
      ? movie.rating.kp
      : (typeof movie.rating?.imdb === 'number' && movie.rating.imdb > 0)
        ? movie.rating.imdb
        : "Нет рейтинга";

  return (
    <Link to={`/movie/${movie.id}`} className={styles.link}>
      <div className={styles.card} style={{ minHeight: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img
          src={posterUrl}
          alt={title}
          className={styles.image}
          style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
        />
        <h3 className={styles.title} style={{ margin: 0, fontSize: 18, textAlign: 'center' }}>{title}</h3>
        <p className={styles.year} style={{ margin: '4px 0', color: '#666' }}>{year}</p>
        <p className={styles.rating} style={{ margin: 0, fontWeight: 500 }}>Рейтинг: {rating}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
