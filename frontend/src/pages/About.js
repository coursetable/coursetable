import React from 'react';

import styles from './About.module.css';
import { Card, CardDeck, Button, Container } from 'react-bootstrap';
import pic from '../images/default_pfp.png';

function App() {
  return (
    <Container>
      <p>About CourseTable description...</p>

      {/* FIRST ROW OF PPL */}

      <CardDeck className={'m-4'}>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 1</Card.Title>
            <Card.Text>Description of person 1</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 2</Card.Title>
            <Card.Text>Description of person 2</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 3</Card.Title>
            <Card.Text>Description of person 3</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
      </CardDeck>

      {/* SECOND ROW OF PPL */}

      <CardDeck className={'m-4'}>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 4</Card.Title>
            <Card.Text>Description of person 4</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 5</Card.Title>
            <Card.Text>Description of person 5</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Img variant="top" src={pic} />
          <Card.Body>
            <Card.Title>Name 6</Card.Title>
            <Card.Text>Description of person 6</Card.Text>
            <Button variant="primary">Link</Button>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Footer Text</small>
          </Card.Footer>
        </Card>
      </CardDeck>
    </Container>
  );
}

export default App;
