import React, { useContext } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { FaChevronRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { StyledHoverText, TextComponent } from '../components/StyledComponents';
import styles from './FAQ.module.css';
import { scrollToTop } from '../utilities';

// Card used in FAQ accordion
const StyledCard = styled(Card)`
  background-color: transparent;
  border: none !important;
  border-bottom: 1px solid ${({ theme }) => theme.border} !important;
  transition: border 0.2s linear;

  .active {
    border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.primary};
  }
`;

// Custom accordion component
function ContextAwareToggle({
  eventKey,
  callback,
  question,
}: {
  eventKey: string;
  callback?: (eventKey: string) => void;
  question: string;
}) {
  // Current active item
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  // Is this one currently active?
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <StyledHoverText
      className={`${
        !isCurrentEventKey ? '' : 'active'
      }  d-flex justify-content-between py-3 px-3 ${
        styles.accordion_hover_header
      }`}
      onClick={decoratedOnClick}
    >
      {question}
      <FaChevronRight
        // Rotate arrow when active
        className={`${
          !isCurrentEventKey ? '' : styles.accordion_arrow_active
        } my-auto ${styles.accordion_arrow}`}
      />
    </StyledHoverText>
  );
}

/**
 * Renders the FAQ page
 */
function FAQ() {
  const faqs = [
    {
      title: 'What is CourseTable?',
      contents: (
        <>
          <p>
            CourseTable offers a clean and effective way for Yale students to
            find the courses they want, bringing together course information,
            student evaluations, and course demand statistics in an intuitive
            interface.
          </p>
          <p style={{ marginBottom: '0' }}>A couple disclaimers:</p>
          <ul>
            <li>
              Evaluations are not everything! Professors' personalities and
              teaching styles are often divisive, and you will likely enjoy a
              class up your alley more than the random, most-highly evaluated
              class.
            </li>
            <li>
              Sophomores and freshmen: keep in mind highly-evaluated seminars
              are often filled to the brim.
            </li>
            <li>CourseTable is not affiliated with Yale.</li>
          </ul>
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
    {
      title: 'Who can use CourseTable?',
      contents: (
        <>
          Any Yale student can use CourseTable! However, we do require you to
          log in with your Yale ID, since some of the information we provide is
          not available to the general public.
        </>
      ),
    },
    {
      title: 'Where does CourseTable get the data?',
      contents: (
        <>
          We source our data from a combination of Yale's{' '}
          <a
            href="https://courses.yale.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            course catalog
          </a>
          ,{' '}
          <a
            href="https://oce.app.yale.edu/oce-viewer/studentViewer/index"
            target="_blank"
            rel="noopener noreferrer"
          >
            historical evaluations database
          </a>
          , and{' '}
          <a
            href="https://ivy.yale.edu/course-stats/"
            target="_blank"
            rel="noopener noreferrer"
          >
            course demand portal
          </a>
          . Some of the information is also pulled from our historical archives
          of the aforementioned data sources.
        </>
      ),
    },
    {
      title: 'How often is CourseTable updated?',
      contents: (
        <>
          We update our database every day around 3:30am EST. If anything
          continues to not match Yale's catalog after a few days, please let us
          know through our{' '}
          <NavLink to="/feedback" onClick={scrollToTop}>
            feedback form
          </NavLink>
          .
        </>
      ),
    },
    {
      title: "Can I use CourseTable's data for a project?",
      contents: (
        <>
          Sure. Shoot us an <a href="mailto: harshal.sheth@yale.edu">email</a>{' '}
          with a brief description of your project, and we'll get back to you
          shortly.
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
          CourseTable is run by a small{' '}
          <NavLink to="/about" onClick={scrollToTop}>
            team
          </NavLink>{' '}
          of volunteers within the Yale Computer Society.
        </>
      ),
    },
    {
      title: 'What is the history of CourseTable?',
      contents: (
        <>
          <p>
            CourseTable was created in 2012 by Peter Xu (Yale MC '14) and Harry
            Yu (Yale SY '14).
          </p>
          <p>
            In 2014,{' '}
            <a
              href="https://legacy.coursetable.com/Blog.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yale unceremoniously blocked it from campus networks.
            </a>{' '}
            After significant internal and external pressure, these restrictions
            were removed.
          </p>
          <p>
            In the fall of 2019, the Yale Computer Society{' '}
            <a
              href="https://yaledailynews.com/blog/2019/09/18/coursetable-taken-over-by-computer-society/"
              target="_blank"
              rel="noopener noreferrer"
            >
              took over
            </a>{' '}
            maintenance and development of CourseTable.
          </p>
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
  ];

  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.faq_header} mt-5 mb-1`}>
        Frequently Asked Questions
      </h1>
      <p className={`${styles.faq_description} mb-3`}>
        <TextComponent type={1}>Have another question?</TextComponent>{' '}
        <NavLink to="/feedback" onClick={scrollToTop}>
          Contact us
        </NavLink>
        .
      </p>
      <Accordion>
        {faqs.map((faq, idx) => (
          <StyledCard key={idx}>
            <div>
              <ContextAwareToggle eventKey={`${idx}`} question={faq.title} />
            </div>
            <Accordion.Collapse eventKey={`${idx}`}>
              <Card.Body className="py-3">
                <TextComponent type={1}>{faq.contents}</TextComponent>
              </Card.Body>
            </Accordion.Collapse>
          </StyledCard>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
