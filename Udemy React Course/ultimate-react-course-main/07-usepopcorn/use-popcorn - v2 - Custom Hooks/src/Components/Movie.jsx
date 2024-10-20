import Emoji from "./Emoji";

export default function Movie({ movie, onSelectMovie }) {
    return (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>
                        <Emoji txt="🗓" />
                    </span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}
