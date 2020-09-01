import React from 'react';

import styles from './About.module.css';
import { Card, CardDeck, Button, Row } from 'react-bootstrap';
import pic from '../images/default_pfp.png';
import { Link } from 'react-router-dom';

/**
 * Renders the about us page
 */

function About() {
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.about_header + ' mt-5 mb-1'}>About Us</h1>
      <p className={styles.about_description + ' mb-3 text-muted'}>
        About Us Description
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
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 1</Card.Title>
              <Card.Text className="text-muted">
                Description of person 1
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 2</Card.Title>
              <Card.Text className="text-muted">
                Description of person 2
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 3</Card.Title>
              <Card.Text className="text-muted">
                Description of person 3
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
        {/* SECOND ROW OF PPL */}
        <CardDeck className={'my-3'}>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 4</Card.Title>
              <Card.Text className="text-muted">
                Description of person 4
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 5</Card.Title>
              <Card.Text className="text-muted">
                Description of person 5
              </Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src={pic} />
            <Card.Body>
              <Card.Title>Name 6</Card.Title>
              <Card.Text className="text-muted">
                Description of person 6
              </Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
      </div>
    </div>
  );
}

export default About;
