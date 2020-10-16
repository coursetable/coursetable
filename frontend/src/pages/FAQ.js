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
  const faqs = [
    // TODO: ensure that this link continues to work.
    {
      title: 'What is CourseTable?',
      contents: (
        <>
          CourseTable offers a clean and effective way for Yale students to find
          the courses they want. We source all our data from a combination of
          Yale's course catalog, historical evaluations database, and course
          demand portal. You can read more about the history of our project{' '}
          <a
            href="https://coursetable.com/Blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </>
      ),
    },
    {
      title: 'Who can use CourseTable?',
      contents: (
        <>
          CourseTable's class listings are open for everyone to search and view.
          However, we do require you to log in with your Yale ID to view
          evaluations and use worksheets.
        </>
      ),
    },
    // TODO: Where does the data come from?
    {
      title: 'How often is CourseTable updated?',
      contents: (
        <>
          We update our database daily. If anything continues to not match
          Yale's catalog after a few days, please let us know through our{' '}
          <NavLink to="/feedback" onClick={scrollToTop}>
            feedback form
          </NavLink>
          .
        </>
      ),
    },
    {
      title: 'How are the ratings calculated?',
      contents: (
        <>
          <p>
            We first merge evaluations across the different cross-listings of a
            course. Once we've done this, we compute average overall ratings and
            workloads for each instance of a course, where different semesters
            or sections constitute different instances.
          </p>
          <p>
            The class ratings are an average of the average overall rating for
            every instance of a course code in our database. Similarly, the
            workload rating is an average of the average workload ratings. If a
            class has multiple sections, each section goes into this average as
            a separate number. If the class is cross-listed under multiple
            course codes, any match course code is included in the computation.
          </p>
          <p>
            The class ratings are an average of the average overall rating for
            The professor rating is an average of the average overall rating for
            every course which a professor has taught. A course is included in
            this calculation even if it was co-taught with other professor(s).
          </p>
          <p>
            We have course evaluation data going back to 2009. All of this data
            is included in the ratings calculations.
          </p>
        </>
      ),
    },
    {
      title: 'Where can I submit feedback or report bugs?',
      contents: (
        <>
          If you have a suggestion or find a bug, please submit our{' '}
          <NavLink to="/feedback" onClick={scrollToTop}>
            general feedback form
          </NavLink>
          . We'll be in touch as soon as possible.
        </>
      ),
    },
    {
      title: 'Who runs CourseTable?',
      contents: (
        <>
          The Yale Computer Society{' '}
          <a
            href="https://yaledailynews.com/blog/2019/09/18/coursetable-taken-over-by-computer-society/"
            target="_blank"
            rel="noopener noreferrer"
          >
            took over CourseTable
          </a>{' '}
          in the fall of 2019. It is now run by{' '}
          <NavLink to="/about" onClick={scrollToTop}>
            these wonderful developers and designers
          </NavLink>
          .
        </>
      ),
    },
    {
      title: 'How can I contribute?',
      contents: (
        <>
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
        </>
      ),
    },
    {
      title: 'What happened to the old CourseTable?',
      contents: (
        <>
          Over the summer of 2020, we rebuilt CourseTable as a modern site that
          will be easier to update and maintain going forward. If we're missing
          a feature from the old site that you would like to see added back,
          please{' '}
          <NavLink to="/feedback" onClick={scrollToTop}>
            let us know
          </NavLink>
          .
        </>
      ),
    },
  ];

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
        {faqs.map((faq, idx) => (
          <Card key={idx} className={styles.accordion_card}>
            <div className={styles.accordion_header}>
              <ContextAwareToggle eventKey={`${idx}`} question={faq.title} />
            </div>
            <Accordion.Collapse eventKey={`${idx}`}>
              <Card.Body className="text-muted py-3">{faq.contents}</Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
