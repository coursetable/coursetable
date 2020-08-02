import React, { useContext } from 'react';
import { Accordion, Row, Col, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import styles from './FAQ.module.css';
import { FaChevronRight } from 'react-icons/fa';

function ContextAwareToggle({ eventKey, callback, question }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

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
        className={
          (!isCurrentEventKey ? '' : styles.accordion_arrow_active) +
          ' my-auto ' +
          styles.accordion_arrow
        }
      />
    </div>
  );
}

function FAQ() {
  const filler_text =
    'This is an example response to a frequently asked question. ' +
    "I'm taking up multiple lines so it looks better when demo'd. " +
    "I can't decide if I like black or muted text more, so let me " +
    'know if you have any preferences.';

  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.faq_header + ' mt-5 mb-1'}>
        Frequently Asked Questions
      </h1>
      <p className={styles.faq_description + ' mb-3 text-muted'}>
        FAQ Description
      </p>
      <Accordion>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="0" question="Question 1" />
          </div>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="1" question="Question 2" />
          </div>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="2" question="Question 3" />
          </div>
          <Accordion.Collapse eventKey="2">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="3" question="Question 4" />
          </div>
          <Accordion.Collapse eventKey="3">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="4" question="Question 5" />
          </div>
          <Accordion.Collapse eventKey="4">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="5" question="Question 6" />
          </div>
          <Accordion.Collapse eventKey="5">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="6" question="Question 7" />
          </div>
          <Accordion.Collapse eventKey="6">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card className={styles.accordion_card}>
          <div className={styles.accordion_header}>
            <ContextAwareToggle eventKey="7" question="Question 8" />
          </div>
          <Accordion.Collapse eventKey="7">
            <Card.Body className="text-muted py-3">{filler_text}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default FAQ;
