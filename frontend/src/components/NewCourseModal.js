import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';

import { IoMdArrowRoundBack, IoIosArrowDown } from 'react-icons/io';
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
import CourseModalLoading from './CourseModalLoading';
import { useSearchAverageAcrossSeasonsQuery } from '../generated/graphql';

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

  // Called when hiding modal
  const handleHide = useCallback(() => {
    posthog.capture('modal-hide');

    hideModal();
  }, [hideModal]);

  const { loading, error, data } = useSearchAverageAcrossSeasonsQuery({
    variables: {
      course_code:
        listing && listing.course_code ? listing.course_code : 'bruh',
      professor_name:
        listing && listing.professor_names ? listing.professor_names : ['bruh'],
    },
  });

  const all_listings = useMemo(() => {
    const temp_listings = {};
    if (data) {
      data.computed_listing_info.forEach((cur_listing) => {
        if (cur_listing.course_code !== listing.course_code) return;
        const season = cur_listing.season_code;
        if (!temp_listings[season]) temp_listings[season] = [];
        temp_listings[season].push({
          crn: cur_listing.crn,
          course_code: cur_listing.course_code,
          section: cur_listing.section,
          profs: cur_listing.professor_names,
          evals: cur_listing.course.evaluation_statistics[0],
          season_code: cur_listing.season_code,
        });
      });
    }
    return temp_listings;
  }, [data, listing]);

  return (
    <div className="d-flex justify-content-center">
      {listing && (
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
                    <Row className="mx-auto">
                      <span>{listing.course_code}</span>
                      <TextComponent type={3} className="ml-2">
                        {`0${listing.section.toString()}`.slice(-2)}
                      </TextComponent>
                      {all_listings[listing.season_code] &&
                        all_listings[listing.season_code].length > 1 && (
                          <TextComponent type={3} className="d-flex ml-1">
                            <IoIosArrowDown className="m-auto" size={12} />
                          </TextComponent>
                        )}
                    </Row>
                  </Modal.Title>
                  <Row className="mx-auto mt-1">{listing.title}</Row>
                </Col>
                <Col xs="auto" className="my-auto p-0">
                  Add
                </Col>
              </Row>
            </Container>
          </Modal.Header>

          {show &&
            (loading ? (
              <CourseModalLoading />
            ) : (
              <CourseModalOverview
                listing={listing}
                all_listings={all_listings}
              />
            ))}
        </StyledModal>
      )}
    </div>
  );
};

export default React.memo(CourseModal);
