import React from 'react';
import ReactDOM from 'react-dom';
import EvaluationModal from './EvaluationModal';

export function mount(Component, container, props) {
  ReactDOM.render(<Component {...props} />, container);
}

export function unmount(container) {
  ReactDOM.unmountComponentAtNode(container);
}

export { EvaluationModal };

export default {
  EvaluationModal,
  mount,
  unmount,
};
