import { configure, addDecorator } from '@storybook/react';
import React from 'react';

const clientReq = require.context('../web/jsNew', true, /\.stories\.tsx?$/);

function loadStories() {
  clientReq.keys().forEach(filename => clientReq(filename));
}

configure(loadStories, module);
