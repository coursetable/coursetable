import React from 'react';
import { createRoot } from 'react-dom/client';
import Globals from './Globals';
import _ from 'lodash';

import App from './App';

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

console.log(_);

root.render(
  <Globals>
    <App />
  </Globals>,
);
