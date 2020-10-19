import React from 'react';

import styles from './About.module.css';
import { Card, CardDeck, Button, Row } from 'react-bootstrap';
//import pic from '../images/default_pfp.png';
import { Link } from 'react-router-dom';

import ae from '../images/headshots/aidan-evans.jpg'
import ml from '../images/headshots/michelle-li.jpg'
import hs from '../images/headshots/harshal-sheth.jpg'
import jc from '../images/headshots/josh-chough.jpg'
import dl from '../images/headshots/deyuan-li.jpg'
import kh from '../images/headshots/kevin-hu.jpg'
import ma from '../images/headshots/murad-avliyakulov.jpg'
import ag from '../images/headshots/abhijit-gupta.jpg'
import my from '../images/headshots/max-yuan.jpg'
import sh from '../images/headshots/sidney-hirschman.jpeg'
import hl from '../images/headshots/hao-li.jpg'
import df from '../images/headshots/dylan-fernandez-de-lara.jpg'

/**
 * Renders the about us page
 */

function About() {
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.about_header + ' mt-5 mb-1'}>About Us</h1>
      <p className={styles.about_description + ' mb-3 text-muted'}>
        CourseTable was a course-data processor created by Peter Xu (Yale MC '14) and 
        Harry Yu (Yale SY '14) and is continuing to be developed by the Yale Computer Society. 
        It helps you find the courses at Yale where you'll learn and enjoy the most.
      </p>
      <p className={styles.about_description + ' mb-3 text-muted'}>
        After CourseTable's creation in 2013,{' '}
        <a
          href="https://coursetable.com/Blog"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yale unceremonisously blocked it from campus networks.
        </a>
        {' '}Restrictions were later removed and as of 2019, CourseTable has been maintained and developed by the Yale Computer Society.
      </p>
      <p className={styles.about_description + ' mb-3 text-muted'}>
        To learn more about how to use and the history of CourseTable please see{' '}
        <Link to="/faq">
          the FAQ page.
        </Link>
      </p>
      <Row className="mx-auto">
        <Link to="/joinus" className="mx-auto">
          <Button>Join Us</Button>
        </Link>
      </Row>

      <div className={styles.profile_cards + ' my-3'}>
        {/* FIRST ROW OF PPL */}
        <CardDeck className={'my-3'}>
          <Card>
            <Card.Img variant="top" src={hs} />
            <Card.Body>
              <Card.Title>Harshal Sheth</Card.Title>
              <Card.Text className="text-muted">
                CourseTable Lead
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={ml} />
            <Card.Body>
              <Card.Title>Michelle M. Li</Card.Title>
              <Card.Text className="text-muted">
                Design Lead
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={kh} />
            <Card.Body>
              <Card.Title>Kevin Hu</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
        {/* SECOND ROW OF PPL */}
        <CardDeck className={'my-3'}>
          <Card>
            <Card.Img variant="top" src={my} />
            <Card.Body>
              <Card.Title>Max Yuan</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={ma} />
            <Card.Body>
              <Card.Title>Murad Avliyakulov</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={df} />
            <Card.Body>
              <Card.Title>Dylan Fernandez de Lara</Card.Title>
              <Card.Text className="text-muted">
                Design
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
        {/* THIRD ROW OF PPL */}
        <CardDeck className={'my-3'}>
          <Card>
            <Card.Img variant="top" src={ag} />
            <Card.Body>
              <Card.Title>Abhijit Gupta</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={sh} />
            <Card.Body>
              <Card.Title>Sidney Hirschman</Card.Title>
              <Card.Text className="text-muted">
                Design
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={hl} />
            <Card.Body>
              <Card.Title>Hao Li</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
        {/* FOURTH ROW OF PPL */}
        <CardDeck className={'my-3'}>
          <Card>
            <Card.Img variant="top" src={jc} />
            <Card.Body>
              <Card.Title>Josh Chough</Card.Title>
              <Card.Text className="text-muted">
                Design
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={ae} />
            <Card.Body>
              <Card.Title>Aidan Evans</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={dl} />
            <Card.Body>
              <Card.Title>Deyuan Li</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
      </div>
    </div>
  );
}

export default About;
