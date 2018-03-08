exports.type = `
  enum PosterSize {
    THUMB
    SMALL
    MEDIUM
    LARGE
    ORIGINAL
  }

  type Movie {
    id: ID!
    title: String!
    voteAverage: Float!
    posterPath(size: PosterSize): String!
    backdropPath: String!
    overview: String!
    tagline: String
    runtime: Int
    revenue: Int
    releaseDate: Date
    isFavorite: Boolean!
  }

  extend type Query {
    movie(id: ID!): Movie
    movies(page: Int): [Movie!]!
  }

  extend type Mutation {
    addToFavorites(id: ID!): Movie
  }
`;

const favorites = new Set();

exports.resolvers = {
  Mutation: {
    addToFavorites: (root, { id }, { loaders }) => {
      favorites.add(id);
      return loaders.axiosLoader
        .load([`3/movie/${id}`])
        .then(res => res.data);
    }
  },
  PosterSize: {
    THUMB: 'w92',
    SMALL: 'w185',
    MEDIUM: 'w500',
    LARGE: 'w780',
    ORIGINAL: 'original'
  },
  Movie: {
    posterPath: (root, {size = 'original'}) => {
      return `https://image.tmdb.org/t/p/${size}${root.posterPath}`;
    },
    backdropPath: root => {
      return `https://image.tmdb.org/t/p/w1280${root.backdropPath}`;
    },
    isFavorite: movie => favorites.has(String(movie.id))
  },
  Query: {
    movies: (root, { page = 1 }, { loaders }) => {
      return loaders.axiosLoader
        .load(['3/discover/movie', { params: { page } }])
        .then(res => res.data.results);
    },
    movie: (root, { id }, { loaders }) => {
      return loaders.axiosLoader
        .load([`3/movie/${id}`])
        .then(res => res.data);
    }
  }
};