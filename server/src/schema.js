const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDate } = require('graphql-iso-date');
const mergeSchema = require('./types');
const axios = require('./axios');
const DataLoader = require('dataloader');

const typeDefs = [
  `
  scalar Date

  type Query {
    version: String!
  }

  type Mutation {
    noop: String
  }
`
];

const resolvers = {
  Query: {
    version: () => '1'
  },
  Date: GraphQLDate,
  Mutation: {
    noop: () => null
  }
};

module.exports = {
  schema: makeExecutableSchema(mergeSchema({ typeDefs, resolvers })),
  context: req => {
    return {
      axios,
      loaders: {
        // axiosLoader.load([url, params])
        axiosLoader: new DataLoader(queries => {
          return Promise.all(
            queries.map(([url, params]) => {
              return axios.get(url, params)
            })
          )
        },
          { cacheKeyFn: query => JSON.stringify(query) }
        )
      }
    };
  }
};
