import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo';
import App from './components/App';
import './index.scss';

const app =
<ApolloProvider client={client}>
  <App />
</ApolloProvider>;

ReactDOM.render(app, document.getElementById('root'));
