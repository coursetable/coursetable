import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';

import { IoMdArrowRoundBack } from 'react-icons/io';
import chroma from 'chroma-js';
import posthog from 'posthog-js';
import styled from 'styled-components';
import CourseModalOverview from './NewCourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';

import WorksheetToggleButton from './WorksheetToggleButton';
import { useWindowDimensions } from './WindowDimensionsProvider';

import styles from './NewCourseModal.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { skillsAreasColors } from '../queries/Constants';
import { TextComponent, StyledLink } from './StyledComponents';
import { toSeasonString } from '../courseUtilities';

// Course Modal
const StyledModal = styled(Modal)`
  .modal-dialog {
    margin: 1.75rem 0 1.75rem auto !important;
  }

  .modal-content {
    background-color: ${({ theme }) => theme.surface[0]};
    .modal-header {
      margin: 2rem 2rem 0 2rem;
      padding: 0 !important;
      .close {
        color: ${({ theme }) => theme.text[0]} !important;
      }
    }
    .modal-body {
      margin: 0 2rem;
      padding: 0 !important;
    }
  }
`;

// More info button
const StyledMoreInfo = styled.span`
  padding: 3px 5px;
  font-size: 14px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.multivalue};
  color: ${({ theme }) => theme.text[0]};
  font-weight: 500;
  &:hover {
    filter: brightness(80%);
    cursor: pointer;
  }
`;

/**
 * Displays course modal when clicking on a course
 * @prop listing - dictionary that holds listing info
 * @prop hideModal - function to hide modal
 * @prop show - boolean that determines when to show modal

 */

const CourseModal = ({ listing, hideModal, show }) => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  // Switch to mobile view?
  const isMobile = width < 768;
  // Viewing overview or an evaluation? List contains [season code, listing info] for evaluations
  const [view, setView] = useState(['overview', null]);
  // Current evaluation filter (both, course, professor)
  const [filter, setFilter] = useState('both');
  // Stack for listings that the user has viewed
  const [listings, setListings] = useState([]);
  useEffect(() => {
    setListings([listing]);
  }, [listing]);
  // Current listing that we are viewing overview info for
  const cur_listing =
    listings.length > 0 ? listings[listings.length - 1] : null;

  // Set which evaluation we are viewing
  const setSeason = useCallback((evaluation) => {
    setView([evaluation.season_code, evaluation]);
  }, []);

  // Called when hiding modal
  const handleHide = useCallback(() => {
    posthog.capture('modal-hide');

    // Reset views and filters
    setView(['overview', null]);
    setFilter('both');
    hideModal();
  }, [hideModal]);

  // Called when user requests more info about a course from the eval page.
  const handleMoreInfo = useCallback(() => {
    // Go to overview page of this eval course
    setView(['overview', null]);
    const new_listing = { ...view[1].listing };
    new_listing.eval = view[1];
    setListings([...listings, new_listing]);
  }, [listings, view]);

  // key variable for lists
  const key = 0;

  return (
    <div className="d-flex justify-content-center">
      {cur_listing && (
        <StyledModal
          show={show}
          scrollable
          onHide={handleHide}
          dialogClassName="modal-custom-width"
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Container className="p-0" fluid>
              <Row className="m-auto">
                <Col className="p-0">
                  <Modal.Title>
                    <span>{cur_listing.course_code}</span>
                    <TextComponent type={3} className="ml-2">
                      {('0' + cur_listing.section.toString()).slice(-2)}
                    </TextComponent>
                  </Modal.Title>
                  <Row className="mx-auto mt-1">{cur_listing.title}</Row>
                </Col>
                <Col xs="auto" className="my-auto p-0">
                  Add
                </Col>
              </Row>
            </Container>
          </Modal.Header>

          {show && (
            <CourseModalOverview
              setFilter={setFilter}
              filter={filter}
              setSeason={setSeason}
              listing={cur_listing}
            />
          )}
        </StyledModal>
      )}
    </div>
  );
};

export default React.memo(CourseModal);
