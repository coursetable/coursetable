import { Provider } from 'react-redux';
import { Playground, store } from 'graphql-playground-react';

import { API_ENDPOINT } from '../config';

const Graphiql = () => (
  <>
    <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css"
    />
    <Provider store={store}>
      <Playground
        endpoint={`${API_ENDPOINT}/ferry/v1/graphql`}
        settings={{ 'editor.theme': 'light', 'request.credentials': 'include' }}
      />
    </Provider>
  </>
);
export default Graphiql;
