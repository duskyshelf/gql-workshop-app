import ApolloClient from 'apollo-boost';
import { isContext } from 'vm';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  request: operation => {
    operation.setContext(context => {
      return {
      headers: {
        ...context.headers,
        authorization: localStorage.getItem('token')
      }
    }})
  }
});

export default client;
