import { createGlobalStyle } from './typed-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Maven+Pro&display=swap');
  ${reset}
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  input,
  button {
    &:focus,
    &:active {
      outline: none
    }
  }
  h1,h2,h3,h4,h5,h6{
      font-family:'Maven Pro', sans-serif;
  }
`;

export default GlobalStyles;
