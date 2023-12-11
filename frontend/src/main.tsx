import React from 'react';
import { createRoot } from 'react-dom/client';
import Globals from './Globals';

import App from './App';

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <Globals>
    <App />
  </Globals>,
);
