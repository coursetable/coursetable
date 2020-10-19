import React from 'react';

import styles from './About.module.css';
import { Card, CardDeck, Button, Row } from 'react-bootstrap';
//import pic from '../images/default_pfp.png';
import { Link } from 'react-router-dom';

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

/**
 * Renders the about us page
 */

function About() {
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
      role: 'Development',
    },
    {
      name: 'Max Yuan',
      image: my,
      role: 'Development',
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
      role: 'Design',
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

  //splits people into rows of three
  var rows = [],
    size = 3;
  for (var i = 0; i < people.length; i += size) {
    rows.push(people.slice(i, i + size));
  }

  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.about_header + ' mt-5 mb-1'}>About Us</h1>

      <p className={styles.about_description + ' mb-3 text-muted'}>
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

      <Row className="mx-auto">
        <div className="mx-auto">
          <Link to="faq">
            <Button variant="outline-secondary">FAQ</Button>
          </Link>
          <span style={{ width: '1em', display: 'inline-block' }}></span>
          <Link to="/joinus">
            <Button>Join Us</Button>
          </Link>
        </div>
      </Row>

      <div className={styles.profile_cards + ' my-3'}>
        {rows.map((row, idx) => (
          <CardDeck key={idx} className={'my-3'}>
            {row.map((person, idy) => (
              <Card key={idx + ' ' + idy}>
                <Card.Img variant="top" src={person.image} />
                <Card.Body>
                  <Card.Title>{person.name}</Card.Title>
                  <Card.Text className="text-muted">{person.role}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        ))}
      </div>
    </div>
  );
}

export default About;
