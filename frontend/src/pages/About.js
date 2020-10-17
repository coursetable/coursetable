import React from 'react';

import styles from './About.module.css';
import { Card, CardDeck, Button, Row } from 'react-bootstrap';
import pic from '../images/default_pfp.png';
import { Link } from 'react-router-dom';

import ae from '../images/headshots/aidan-evans.jpg'
import ml from '../images/headshots/michelle-li.jpg'
import hs from '../images/headshots/harshal-sheth.jpg'
import jc from '../images/headshots/josh-chough.jpg'

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
            <Card.Img variant="top" src={pic} />
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
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Max Yuan</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Murad Avliyakulov</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
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
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Abhijit Gupta</Card.Title>
              <Card.Text className="text-muted">
                Development
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Sidney Hirschman</Card.Title>
              <Card.Text className="text-muted">
                Design
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
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
            <Card.Img variant="top" src={pic} />
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
