import React, { useContext } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import styles from './FAQ.module.css';
import { FaChevronRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import { scrollToTop } from '../utilities';

// Custom accordion component
function ContextAwareToggle({ eventKey, callback, question }) {
  // Current active item
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  // Is this one currently active?
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className={
        (!isCurrentEventKey ? '' : styles.accordion_hover_header_active) +
        '  d-flex justify-content-between py-3 px-3 ' +
        styles.accordion_hover_header
      }
      onClick={decoratedOnClick}
    >
      {question}
      <FaChevronRight
        // Rotate arrow when active
        className={
          (!isCurrentEventKey ? '' : styles.accordion_arrow_active) +
          ' my-auto ' +
          styles.accordion_arrow
        }
      />
    </div>
  );
}

/**
 * Renders the FAQ page
 */

function FAQ() {
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.faq_header + ' mt-5 mb-1'}>
        Frequently Asked Questions
      </h1>
      <p className={styles.faq_description + ' mb-3 text-muted'}>
        Have another question?{' '}
        <NavLink to="/feedback" onClick={scrollToTop}>
          Contact us
        </NavLink>
        .
      </p>
      <Accordion>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="0" question="What is CourseTable?" />
          </div>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="text-muted py-3">
              CourseTable offers a clean and effective way for Yale students to
              find the courses they want. We source all our data from a
              combination of Yale's course catalog, historical evaluations
              database, and course demand portal. You can read more about the
              history of our project{' '}
              <a
                href="https://coursetable.com/Blog"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle
              eventKey="1"
              question="Who can use CourseTable?"
            />
          </div>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="text-muted py-3">
              CourseTable's class listings are open for everyone to search and
              view. However, we do require you to log in with your Yale ID to
              view evaluations and use worksheets.
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle
              eventKey="2"
              question="How often is CourseTable updated?"
            />
          </div>
          <Accordion.Collapse eventKey="2">
            <Card.Body className="text-muted py-3">
              We update our database daily. If anything continues to not match
              Yale's catalog after a few days, please let us know through our{' '}
              <NavLink to="/feedback" onClick={scrollToTop}>
                feedback form
              </NavLink>
              .
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle
              eventKey="3"
              question="Where can I submit feedback or report bugs?"
            />
          </div>
          <Accordion.Collapse eventKey="3">
            <Card.Body className="text-muted py-3">
              If you have a suggestion or find a bug, please submit our{' '}
              <NavLink to="/feedback" onClick={scrollToTop}>
                general feedback form
              </NavLink>
              . We'll be in touch as soon as possible.
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="4" question="How can I contribute?" />
          </div>
          <Accordion.Collapse eventKey="4">
            <Card.Body className="text-muted py-3">
              The CourseTable website is open-source and available at our{' '}
              <a
                href="https://github.com/coursetable/coursetable"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub repository
              </a>
              . If you'd like to join the team, check out our{' '}
              <NavLink to="/joinus" onClick={scrollToTop}>
                application
              </NavLink>
              !
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle
              eventKey="5"
              question="What happened to the old CourseTable?"
            />
          </div>
          <Accordion.Collapse eventKey="5">
            <Card.Body className="text-muted py-3">
              Over the summer of 2020, we rebuilt CourseTable as a modern site
              that will be easier to update and maintain going forward. If we're
              missing a feature from the old site that you would like to see
              added back, please{' '}
              <NavLink to="/feedback" onClick={scrollToTop}>
                let us know
              </NavLink>
              .
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default FAQ;
