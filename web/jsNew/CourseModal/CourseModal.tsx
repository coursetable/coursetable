import React from 'react';
import { CourseWithExtras } from '../types';
import EvaluationRow from './EvaluationRow';

interface Props {
  course: CourseWithExtras;
  season: string;
  coursesTakenPrompted: 'Not prompted' | 'Shared' | 'Skipped';
  evaluationsEnabled: boolean;
  onClose: () => unknown;
}

/** Convert a season to a short text (e.g., W19, F18) */
function seasonToShortString(season: string) {
  const year = season.toString().substr(0, 4);
  const termNum = season.toString().substr(4, 2);

  let termPrefix: string = '';
  switch (termNum) {
    case '01':
      termPrefix = 'W';
      break;
    case '02':
      termPrefix = 'A';
      break;
    case '03':
      termPrefix = 'F';
      break;
  }

  return termPrefix + year.substr(2, 2);
}

/** Convert a season to a longer description (e.g., 2019 Fall, 2018 Spring) */
function seasonToString(season: string) {
  const year = season.toString().substring(0, 4);
  let seasonText = '';
  switch (season.toString().substring(4, 6)) {
    case '01':
      seasonText = 'Spring';
      break;
    case '02':
      seasonText = 'Summer';
      break;
    case '03':
      seasonText = 'Fall';
      break;
  }

  return `${year} ${seasonText}`;
}

export default class CourseModal extends React.PureComponent<Props> {
  render() {
    const {
      course,
      season,
      coursesTakenPrompted,
      evaluationsEnabled,
      onClose,
    } = this.props;

    const shortExtraInfo = {
      Cancelled: 'Cancelled',
      'Moved to preceding fall term': 'Moved to fall',
      'Number changed-See description': '# changed',
    };
    const {
      extra_info: extraInfo,
      skills,
      areas,
      codes,
      long_title: longTitle,
      description,
      requirements,
      professors,
      times,
      flags,
      evaluations,
      friends,
      syllabus_url: syllabusUrl,
      course_home_url: courseHomeUrl,
      taken_before: takenBefore,
    } = course;

    const term = seasonToShortString(season);

    const firstCode = codes[0];
    const textbookXML = [
      '<?xml version="1.0" encoding="UTF-8"?><textbookorder><courses>',
      '<course dept="' +
        firstCode.subject +
        '" num="' +
        firstCode.number +
        '" sect="' +
        ('0' + firstCode.section).substr(-2) +
        '" ',
      'term="' + term + '" /></courses></textbookorder>',
    ].join('');
    const textbookLink =
      'http://yale.bncollege.com/webapp/wcs/stores/servlet/TBListView?storeId=16556&catalogId=10001&langId=-1&termMapping=N&courseXml=' +
      encodeURIComponent(textbookXML);

    return (
      <>
        <div className="modal-header">
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
          <p>
            <span className="badges">
              {extraInfo && (
                <span className="badge badge-important">
                  {shortExtraInfo[extraInfo]}
                </span>
              )}
              {skills.map(skill => (
                <span key={skill} className="badge badge-skill">
                  {skill}
                </span>
              ))}
              {areas.map(area => (
                <span key={area} className="badge badge-area">
                  {area}
                </span>
              ))}
            </span>
            <small>
              {codes.map((code, i) => (
                <span key={code.row_id}>
                  {i != 0 && ' / '}
                  <span className="text-info">
                    {code.subject}&nbsp;{code.number}
                    {code.section !== '1' && (
                      <>(&nbsp;{('00' + code.section).substr(-2)})</>
                    )}
                  </span>
                </span>
              ))}
            </small>
          </p>
          <div className="pull-right">
            <a
              href={textbookLink}
              className="btn textbooks-button"
              target="_blank"
              title="View textbooks at the Yale Barnes &amp; Noble bookstore"
            >
              <i className="icon-book" /> Textbooks
            </a>{' '}
            <button type="button" className="btn add-remove-worksheet">
              <i className="icon-plus" /> Add to worksheet
            </button>
          </div>
          <h4>{longTitle}</h4>
        </div>

        <div className="modal-body">
          <div className="row-fluid">
            <div className="course-info span7">
              <p>{description}</p>
              {requirements && <p>{requirements}</p>}
              <table className="table table-bordered">
                <tr>
                  <th>Taught by</th>
                  <td>{professors.join(', ')}</td>
                </tr>
                <tr>
                  <th>Meets</th>
                  <td>{times.long_summary}</td>
                </tr>
                {flags.length !== 0 && (
                  <tr>
                    <th>Notes</th>
                    <td>
                      {flags
                        .filter(f => f.length > 1)
                        .map((flag, i) => (
                          <span key={flag}>
                            {i !== 0 && <br />}
                            {flag}
                          </span>
                        ))}
                    </td>
                  </tr>
                )}

                {(syllabusUrl || courseHomeUrl) && (
                  <tr>
                    <th>Links</th>
                    <td>
                      {syllabusUrl && (
                        <a href={syllabusUrl} target="_blank">
                          Syllabus
                        </a>
                      )}
                      {courseHomeUrl && (
                        <a href={courseHomeUrl} target="_blank">
                          Course Home
                        </a>
                      )}
                    </td>
                  </tr>
                )}
                {friends.length !== 0 && (
                  <tr>
                    <th>Friends shopping</th>
                    <td>
                      {friends.map((friend, i) => (
                        <span key={friend.name}>
                          {i !== 0 && <br />}
                          {friend.name}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
                <tr>
                  <th>Friends who took this</th>
                  <td>
                    {coursesTakenPrompted === 'Shared' ? (
                      <>
                        {takenBefore.length === 0 && 'None'}
                        {takenBefore.map((entry, index) => (
                          <span key={index}>
                            {entry.name}
                            {entry.season && seasonToString(entry.season)}
                            <br />
                          </span>
                        ))}
                      </>
                    ) : (
                      <a className="btn" href="/UpdateCoursesTaken">
                        See which friends have taken this
                      </a>
                    )}
                  </td>
                </tr>
              </table>
            </div>

            <div className="course-eval span5">
              <h5>Evaluations</h5>
              <p>
                <span className="label">Same prof. and class</span>{' '}
                <span className="label label-primary">Same prof.</span>{' '}
                <span className="label label-inverse">Same course</span>
              </p>

              {!evaluationsEnabled && (
                <div className="smaller">
                  Evaluations are not enabled.
                </div>
              )}

              {evaluationsEnabled &&
                !evaluations.same_both &&
                !evaluations.same_professors &&
                !evaluations.same_class && (
                  <div className="alert alert-info">
                    There are no evaluations for this course or professor.
                  </div>
                )}

              {evaluations.same_both.map(evaluation => (
                <EvaluationRow
                  key={evaluation.id}
                  evaluation={evaluation}
                  tooltip="Same professor and class"
                  btnClass=""
                />
              ))}
              {evaluations.same_professors.map(evaluation => (
                <EvaluationRow
                  key={evaluation.id}
                  evaluation={evaluation}
                  tooltip="Same professor"
                  btnClass="btn-primary"
                />
              ))}
              {evaluations.same_class.map(evaluation => (
                <EvaluationRow
                  key={evaluation.id}
                  evaluation={evaluation}
                  tooltip="Same course code"
                  btnClass="btn-primary"
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
