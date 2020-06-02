import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import {setContext} from 'apollo-link-context';


// le decimos donde se conectara
const httpLink = createHttpLink({
  uri: "https://ancient-stream-64315.herokuapp.com/", 
  fetch 
});

// Le agregamos un header nuevo


const authLink = setContext((_, { headers }) => {

  const token = localStorage.getItem('token');

  return {
      headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
      }
  }
});

// y lo conectamos a Apollo

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat( httpLink )
});

export default client;
