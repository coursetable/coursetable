import React from 'react';
import { storiesOf } from '@storybook/react';
import CourseModal from './CourseModal';
import { courseSamples } from '../__testData__/Courses';
import { CourseWithExtras } from '../types';

const course: CourseWithExtras = {
  ...courseSamples.ENGL121,
  taken_before: [{ name: 'John Doe', season: '201803' }],
  num_friends: 2,
  friends: [
    { name: 'Peter Xu', facebookId: '1234' },
    { name: 'Harry Yu', facebookId: '578' },
  ],
};

storiesOf('CourseModal', module)
  .add('with ENGL 121 and evaluations enabled', () => (
    <CourseModal
      course={course}
      coursesTakenPrompted="Shared"
      season="201901"
      evaluationsEnabled={true}
      onClose={() => console.log('close')}
    />
  ))
  .add('with ENGL 121 and no evaluations enabled', () => (
    <CourseModal
      course={course}
      coursesTakenPrompted="Shared"
      season="201901"
      evaluationsEnabled={false}
      onClose={() => console.log('close')}
    />
  ));
