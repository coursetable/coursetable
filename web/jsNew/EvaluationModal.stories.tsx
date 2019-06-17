import React from 'react';
import { storiesOf } from '@storybook/react';
import EvaluationModal from './EvaluationModal';
import { evaluationSamples } from './__testData__/Evaluations';

storiesOf('EvaluationModal', module).add('with a newer evaluation', () => (
  <EvaluationModal
    evaluation={evaluationSamples.ENGL121}
    onClose={() => console.log('close')}
  />
));
