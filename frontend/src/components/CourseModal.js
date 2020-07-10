import React from 'react';
import { Col, Table, Modal } from 'react-bootstrap';

const CourseModal = props => {
  const listing = props.listing;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let location_url = '',
    location_name = 'TBD';
  for (let i in days) {
    const day = days[i];
    if (listing[`course.times_by_day.${day}`]) {
      location_url = listing[`course.times_by_day.${day}`][0][3];
      location_name = listing[`course.times_by_day.${day}`][0][2];
    }
  }

  return (
    <div>
      <Modal
        show={props.show}
        scrollable={true}
        onHide={props.hideModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{listing['course.title']}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* COURSE DESCRIPTION */}
          {listing['course.description']}
          <Col sm={6} className="px-0 my-2">
            <Table size="sm">
              <tbody>
                {/* PROFESSORS */}
                {listing['professors'] && (
                  <tr>
                    <td>
                      <strong>Professor</strong>
                    </td>
                    <td>{listing['professors']}</td>
                  </tr>
                )}
                {/* TIMES SUMMARY */}
                {listing['course.times_summary'] !== 'TBA' && (
                  <tr>
                    <td>
                      <strong>Meets</strong>
                    </td>
                    <td>{listing['course.times_summary']}</td>
                  </tr>
                )}
                {/* LOCATION URL */}
                {location_url !== '' && (
                  <tr>
                    <td>
                      <strong>Location</strong>
                    </td>
                    <td>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={location_url}
                      >
                        {location_name}
                      </a>
                    </td>
                  </tr>
                )}
                {/* SYLLABUS URL */}
                {listing['course.syllabus_url'] && (
                  <tr>
                    <td>
                      <strong>Syllabus</strong>
                    </td>
                    <td>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={listing['course.syllabus_url']}
                      >
                        {listing['course_code']}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseModal;
