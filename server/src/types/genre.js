exports.type = `
  type Genre {
    id: ID!
    name: String!
  }

  extend type Query {
    genre(id: ID!): Genre
  }
`;

exports.resolvers = {
  Query: {
    genre: (root, { id }, { loaders }) => {
      return loaders.axiosLoader
        .load([`/3/genre/movie/list`, { params: { page: 1 } }])
        .then(res => res.data.genres.find(genre => genre.id === parseInt(id)));
    }
  }
};