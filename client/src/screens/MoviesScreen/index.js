import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withProps } from 'recompose';
import './moviesScreen.css';

import MovieCard from '../../components/MovieCard';

const FavCount = ({ count }) => {
  return <div className="favCount">
    <i className="fas fa-star fa-2x" />
    <i className="fas fa-circle" />
    <span className="favCountValue">{count}</span>
  </div>
}

const Movies = ({ movies, favorites = [], loading, loadMore }) => {
  if (loading) return null

  return (
    <div className="moviesScreen">
      <div className="header">
        <h1 className="moviesTitle">Discover</h1>
        <Link to="/favorites" ><FavCount count={favorites.length} /></Link>
      </div>
      <div className="moviesResults">
        {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
      </div>
      <button className="button" onClick={loadMore}>
        Load More
      </button>
    </div>
  );
};

/**
 * TODO
 *   - Create HOC graphql component
 *   - Query for data required by movieCard
 *   - Extract movieCard query into a fragment on MovieCard
 *   - Expose relevant props from `data`
 *   - Add pagination using FetchMore
 */

export const MOVIES_QUERY = gql`
  query Movies($page: Int) {
    movies(page: $page) @connection(key: "MOVIES") {
      id
      ...MovieCard
    }
    favorites {
      id
    }
  }
  ${MovieCard.fragment}
`

const withData = graphql(MOVIES_QUERY,
  {
    props: ({ data: { movies, favorites, loading, fetchMore } }) =>
      ({
        movies,
        loading,
        favorites,
        loadMore: () => {
          /* determine the next page int */
          const nextPage = Math.floor(movies.length / 20) + 1;

          return fetchMore({
            variables: {
              page: nextPage
            },
            updateQuery: (previous, { fetchMoreResult }) => {
              if (!previous) return previous;

              return {
                ...previous,
                movies: [
                  ...previous.movies,
                  ...fetchMoreResult.movies
                ]
              };
            }
          });
        }
      })
  }
);

// const withData = withProps(() => ({
//   movies: [{
//     "id": "269149",
//     "title": "Zootopia",
//     "posterPath": "https://image.tmdb.org/t/p/w500/sM33SANp9z6rXW8Itn7NnG1GOEs.jpg",
//     "releaseDate": "2016-02-11",
//     "overview": "Determined to prove herself, Officer Judy Hopps, the first bunny on Zootopia's police force, jumps at the chance to crack her first case - even if it means partnering with scam-artist fox Nick Wilde to solve the mystery.",
//     "isFavorite": true
//   },
//   {
//     "id": "284054",
//     "title": "Black Panther",
//     "posterPath": "https://image.tmdb.org/t/p/w500/bLBUCtMQGJclH36clliPLmljMys.jpg",
//     "releaseDate": "2018-02-13",
//     "overview": "After the events of Captain America: Civil War, King T'Challa returns home to the reclusive, technologically advanced African nation of Wakanda to serve as his country's new leader. However, T'Challa soon finds that he is challenged for the throne from factions within his own country. When two foes conspire to destroy Wakanda, the hero known as Black Panther must team up with C.I.A. agent Everett K.",
//     "isFavorite": false
//   }],
//   favorites: [{
//     "id": "269149",
//     "isFavorite": true
//   }],
//   loading: false
// }));

export default withData(Movies);
