import React from 'react';
import ReactDOM from 'react-dom';
import Globals from './Globals';

import App from './App';

ReactDOM.render(
  <Globals>
    {/* @ts-expect-error TODO: themeToggler should not be a prop; it should be a context */}
    <App />
  </Globals>,
  document.getElementById('root'),
);
