import React, { PureComponent } from 'react';
import _ from 'lodash';
import { update, setState } from 'react-updaters';

import Tabs from './Tabs';
import EvaluationComments from './EvaluationComments';
import Histogram from './Histogram';
import { CourseEvaluation } from './types';

interface Props {
  evaluation: CourseEvaluation;
  onClose: () => unknown;
}

interface State {
  selectedCommentType: string | null;
  sortByLength: boolean;
  showFullQuestion: boolean;
}

const questionTypes = [
  'rating',
  'workload',
  'major',
  'engagement',
  'organization',
  'feedback',
  'challenge',
  'professor',
  'sensitivity',
];

const titles = {
  workload: 'Workload',
  challenge: 'Intellectual challenge',
  rating: 'Overall assessment',
  major: 'Taking for major?',
  engagement: 'Level of engagement',
  organization: 'Well organized for learning?',
  feedback: 'Received clear feedback?',
  professor: 'Overall assessment of professor',
  sensitivity: 'Sensitivity to students and feedback',
};

const tooltips = {
  workload:
    'Relative to other courses you have taken at Yale, the workload of this course was:',
  challenge:
    'Relative to other courses you have taken at Yale, the level of intellectual challenge of this course was:',
  rating: 'What is your overall assessment of this course?',
  major:
    'Do you expect to use this class for credit toward your major, or toward a pre-professional program?',
  engagement: 'Your level of engagement with the course was:',
  organization: 'The course was well organized to facilitate student learning.',
  feedback: 'I received clear feedback that improved my learning.',
  professor: 'What is your overall rating of the primary instructor?',
  sensitivity:
    "The primary instructor's sensitivity to students and ability to provide students with adequate feedback was:",
};

const labels = {
  workload: ['Much Less', 'Less', 'Same', 'Greater', 'Much Greater'],
  challenge: ['Much Less', 'Less', 'Same', 'Greater', 'Much Greater'],
  rating: ['Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'],
  major: ['Yes', 'No'],
  engagement: ['Very low', 'Low', 'Medium', 'High', 'Very high'],
  organization: [
    'Strong disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly agree',
  ],
  feedback: [
    'Strong disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly agree',
  ],
  professor: ['Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'],
  sensitivity: ['Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'],
};

const commentTypes = [
  'summary',
  'recommend',
  'knowledge',
  'strengthsWeaknesses',
  'overall',
  'overallProfessor',
  'teachingAssistant',
  'hoursPerWeek',
];

const commentTitles = {
  summary: 'Summary',
  recommend: 'Recommended?',
  knowledge: 'Knowledge/skills',
  strengthsWeaknesses: 'Strengths/weaknesses',
  overall: 'Overall assessment',
  overallProfessor: 'Professor',
  teachingAssistant: 'Teaching assistant',
  hoursPerWeek: 'Hours spent per week outside class',
};

const commentText = {
  summary:
    'How would you summarize this course? Would you recommend it to another studnet? Why or why not?',
  recommend:
    'Would you recommend this course to another student? Please explain.',
  knowledge:
    'What knowledge, skills, and insights did you develop by taking this course?',
  strengthsWeaknesses:
    'What are the strengths and weaknesses of this course and how could it be improved?',
  overall:
    'Looking back on this course, what is your overall assessment of the course? What are its strengths and weaknesses, and in what ways might it be improved?',
  overallProfessor:
    "Please evaluate the instructor of this course. What are the instructor's strengths and weaknesses, and in what ways might his or her teaching be improved?",
  teachingAssistant:
    'If this course included instruction by a teaching assistant (TA), please evaluate the TA here. What are the strengths and weaknesses and how might their teaching be improved? (Specify name of the TA).',
  hoursPerWeek:
    'Indicate the total number of hours per week (outside the classroom) you spent on this course',
};

const barClasses = ['bar-1', 'bar-2', 'bar-3', 'bar-4', 'bar-5'];
const reverseBarClasses = _.clone(barClasses).reverse();
const neutralBarClasses = null;
const barClassesByType = {
  workload: reverseBarClasses,
  challenge: barClasses,
  rating: barClasses,
  major: neutralBarClasses,
  engagement: barClasses,
  organization: barClasses,
  feedback: barClasses,
};

export default class EvaluationModal extends PureComponent<Props, State> {
  state: State = {
    selectedCommentType: null,
    sortByLength: false,
    showFullQuestion: false,
  };

  selectedCommentType() {
    const { comments } = this.props.evaluation;
    const { selectedCommentType } = this.state;

    if (!selectedCommentType || !comments[selectedCommentType]) {
      return commentTypes.filter(type => !!comments[type])[0];
    } else {
      return selectedCommentType;
    }
  }

  render() {
    const { evaluation } = this.props;
    const {
      names,
      professors,
      long_title: longTitle,
      season,
      comments,
      ratings,
    } = evaluation;
    const { sortByLength, showFullQuestion } = this.state;
    const selectedCommentType = this.selectedCommentType();

    const year = season.toString().substr(0, 4);
    const numericTerm = season.toString().substr(4, 2);
    let term;
    switch (numericTerm) {
      case '01':
        term = 'Spring';
        break;
      case '02':
        term = 'Summer';
        break;
      case '03':
        term = 'Fall';
        break;
    }

    return (
      <div>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
          >
            &times;
          </button>
          <small>
            {names.map(({ subject, number, section }, i) => (
              <span key={`${subject} ${number} ${section}`}>
                {i !== 0 ? ' / ' : ''}
                <span className="text-info">
                  {subject} {number} {('0' + section).substr(-2)}
                </span>
              </span>
            ))}{' '}
            taught by{' '}
            {professors.map((professor, i) => (
              <span>
                {i !== 0 ? ', ' : ''}
                <span className="text-info">{professor}</span>
              </span>
            ))}
          </small>

          <h4>
            <button
              type="button"
              className="btn pull-right"
              onClick={this.props.onClose}
            >
              <i className="icon-arrow-left" /> Back to course
            </button>
            <small>Evaluation for:</small> {longTitle} ({term} {year})
          </h4>
        </div>

        <div className="modal-body">
          <div className="row-fluid">
            <div className="course-info span7">
              {Object.keys(comments).length > 1 && (
                <Tabs
                  tabs={commentTypes
                    .map(type => {
                      if (!comments[type]) return null;
                      return { value: type, label: commentTitles[type] };
                    })
                    .filter(t => !!t)
                    .map(t => t!)}
                  onChange={update(this, 'selectedCommentType')}
                  value={selectedCommentType}
                />
              )}

              {!_.isEmpty(comments) && selectedCommentType && (
                <div className="comments">
                  <p>
                    <strong>{commentText[selectedCommentType]}</strong>
                  </p>
                  <EvaluationComments
                    comments={comments[selectedCommentType]}
                    sortByLength={sortByLength}
                  />
                </div>
              )}
            </div>

            <div className="course-eval span5">
              <div className="pad-left">
                {questionTypes.map(type => {
                  if (!ratings[type]) return null;

                  return (
                    <div key={type}>
                      <h5>
                        {titles[type]}{' '}
                        {!showFullQuestion && (
                          <a
                            href="#showFullQuestion"
                            onClick={setState(
                              this,
                              'showFullQuestion',
                              true,
                              true
                            )}
                          >
                            (Show full question)
                          </a>
                        )}
                      </h5>
                      {showFullQuestion && (
                        <p className="text-muted">{tooltips[type]}</p>
                      )}
                      <Histogram
                        data={ratings[type]}
                        labels={labels[type]}
                        barClasses={barClassesByType[type]}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
