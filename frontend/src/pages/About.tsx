import React from 'react';

import { Card, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import { TextComponent, StyledCard } from '../components/StyledComponents';

// Current Member Headshots
import ae from '../images/headshots/aidan-evans.jpg';
import ml from '../images/headshots/michelle-li.jpg';
import jc from '../images/headshots/josh-chough.jpg';
import dl from '../images/headshots/deyuan-li.jpg';
import kh from '../images/headshots/kevin-hu.jpg';
import ma from '../images/headshots/murad-avliyakulov.jpg';
import ag from '../images/headshots/abhijit-gupta.jpg';
import my from '../images/headshots/max-yuan.jpg';
import sh from '../images/headshots/sidney-hirschman.jpeg';
import df from '../images/headshots/dylan-fernandez-de-lara.jpg';
import eb from '../images/headshots/erik-boesen.jpg';
import eh from '../images/headshots/evan-hu.jpg';
import nk from '../images/headshots/nalin-khanna.jpg';
import ss from '../images/headshots/shayna-sragovicz.jpg';
import lt from '../images/headshots/leck-tang.jpg';
import az from '../images/headshots/anna-zhang.jpg';
import ls from '../images/headshots/lauren-song.jpg';
import js from '../images/headshots/josephine-shin.jpg';

// Alumni Headshots
import hs from '../images/headshots/harshal-sheth.jpg';
import hl from '../images/headshots/hao-li.jpg';

// import generic from '../images/headshots/default_pfp.png';

/**
 * Renders the about us page
 */
const About: React.VFC = () => {
  // TODO: add a link for each person
  const current = [
    {
      name: 'Kevin Hu',
      image: kh,
      role: 'CourseTable Co-Lead',
    },
    {
      name: 'Max Yuan',
      image: my,
      role: 'CourseTable Co-Lead',
    },
    {
      name: 'Michelle M. Li',
      image: ml,
      role: 'Design Lead',
    },
    {
      name: 'Murad Avliyakulov',
      image: ma,
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
    {
      name: 'Erik Boesen',
      image: eb,
      role: 'Development',
    },
    {
      name: 'Evan Hu',
      image: eh,
      role: 'Development',
    },
    {
      name: 'Nalin Khanna',
      image: nk,
      role: 'Development',
    },
    {
      name: 'Josephine Shin',
      image: js,
      role: 'Design',
    },
    {
      name: 'Lauren Song',
      image: ls,
      role: 'Design',
    },
    {
      name: 'Shayna Sragovicz',
      image: ss,
      role: 'Development',
    },
    {
      name: 'Leck Tang',
      image: lt,
      role: 'Development',
    },
    {
      name: 'Anna Zhang',
      image: az,
      role: 'Design',
    },
  ];

  const alumni = [
    {
      name: 'Harshal Sheth',
      image: hs,
      role: 'CourseTable Lead',
    },
    {
      name: 'Hao Li',
      image: hl,
      role: 'Development',
    },
  ];

  const create_cards = (person: any, idx: any) => (
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
  );

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
        <Row className="mx-auto">{current.map(create_cards)}</Row>
      </div>

      <h1 className={`${styles.about_header} mt-5 mb-1`}>CourseTable Alumni</h1>
      <div className="my-3">
        <Row className="mx-auto">{alumni.map(create_cards)}</Row>
      </div>
    </div>
  );
};

export default About;
