import React from 'react';

import { Card, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import { TextComponent, StyledCard } from '../components/StyledComponents';

import ae from '../images/headshots/aidan-evans.jpg';
import ml from '../images/headshots/michelle-li.jpg';
import hs from '../images/headshots/harshal-sheth.jpg';
import jc from '../images/headshots/josh-chough.jpg';
import dl from '../images/headshots/deyuan-li.jpg';
import kh from '../images/headshots/kevin-hu.jpg';
import ma from '../images/headshots/murad-avliyakulov.jpg';
import ag from '../images/headshots/abhijit-gupta.jpg';
import my from '../images/headshots/max-yuan.jpg';
import sh from '../images/headshots/sidney-hirschman.jpeg';
import hl from '../images/headshots/hao-li.jpg';
import df from '../images/headshots/dylan-fernandez-de-lara.jpg';
// import generic from '../images/headshots/default_pfp.png';

/**
 * Renders the about us page
 */
const About: React.VFC = () => {
  // TODO: add a link for each person
  const people = [
    {
      name: 'Harshal Sheth',
      image: hs,
      role: 'CourseTable Lead',
    },
    {
      name: 'Michelle M. Li',
      image: ml,
      role: 'Design Lead',
    },
    {
      name: 'Kevin Hu',
      image: kh,
      role: 'Backend Dev Lead',
    },
    {
      name: 'Max Yuan',
      image: my,
      role: 'Frontend Dev Lead',
    },
    {
      name: 'Murad Avliyakulov',
      image: ma,
      role: 'Development',
    },
    {
      name: 'Hao Li',
      image: hl,
      role: 'Development',
    },
    {
      name: 'Abhijit Gupta',
      image: ag,
      role: 'Development',
    },
    {
      name: 'Dylan Fernandez de Lara',
      image: df,
      role: 'Design',
    },
    {
      name: 'Sidney Hirschman',
      image: sh,
      role: 'Design',
    },
    {
      name: 'Josh Chough',
      image: jc,
      role: 'Development & Design',
    },
    {
      name: 'Aidan Evans',
      image: ae,
      role: 'Development',
    },
    {
      name: 'Deyuan Li',
      image: dl,
      role: 'Development',
    },
  ];

  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.about_header} mt-5 mb-1`}>About Us</h1>
      <TextComponent type={1}>
        <p className={`${styles.about_description} mb-3 mx-auto`}>
          CourseTable offers a clean and effective way for Yale students to find
          the courses they want, bringing together course information, student
          evaluations, and course demand statistics in an intuitive interface.
          It's run by a small team of volunteers within the{' '}
          <a
            href="http://yalecompsociety.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yale Computer Society
          </a>{' '}
          and is completely{' '}
          <a
            href="https://github.com/coursetable"
            target="_blank"
            rel="noopener noreferrer"
          >
            open source
          </a>
          .
        </p>
      </TextComponent>

      <Row className="mx-auto">
        <div className="mx-auto">
          <Link to="faq">
            <Button variant="outline-secondary">FAQ</Button>
          </Link>
          <span style={{ width: '1em', display: 'inline-block' }} />
          <Link to="/joinus">
            <Button>Join Us</Button>
          </Link>
        </div>
      </Row>

      <div className="my-3">
        <Row className="mx-auto">
          {people.map((person, idx) => (
            <div key={idx} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
              <StyledCard style={{ height: '100%' }}>
                <Card.Img variant="top" src={person.image} alt={person.name} />
                <Card.Body className="p-3">
                  <Card.Title className="mb-1">{person.name}</Card.Title>
                  <Card.Text>
                    <TextComponent type={1}>{person.role}</TextComponent>
                  </Card.Text>
                </Card.Body>
              </StyledCard>
            </div>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default About;
