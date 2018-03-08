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

const Movies = ({ favorites, loading }) => {
  if (loading) return null

  return (
    <div className="moviesScreen">
      <div className="header">
        <h1 className="moviesTitle">Discover</h1>
        <Link to="/favorites" ><FavCount count={favorites.length} /></Link>
      </div>
      <div className="moviesResults">
        {favorites.map(movie => <MovieCard key={movie.id} {...movie} />)}
      </div>
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
      ...MovieCard
    }
  }
  ${MovieCard.fragment}
`

const withData = graphql(MOVIES_QUERY,
  {
    props: ({ data: { favorites, loading } }) => ({
      loading,
      favorites
    })
  }
);

export default withData(Movies);
