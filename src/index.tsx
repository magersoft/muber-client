import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';
import App from './components/App';
import './index.scss';

const app =
<ApolloProvider client={client}>
  <App />
</ApolloProvider>;

ReactDOM.render(app, document.getElementById('root'));
