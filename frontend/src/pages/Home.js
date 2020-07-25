import React, { useState, useRef } from 'react';
import {
  CardDeck,
  Card,
  Form,
  InputGroup,
  Button,
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import Logo from '../components/Logo';
import styles from './Home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Redirect } from 'react-router-dom';

function Home() {
  const [value, setValue] = useState('');
  let input = useRef();
  const searched = (event) => {
    event.preventDefault();
    // console.log(input.current.value);
    setValue(input.current.value);
  };
  if (value) {
    window.scrollTo(0, 0);
  }

  return value ? (
    <Redirect to={{ pathname: '/catalog', state: { search_val: value } }} />
  ) : (
    <div className={styles.container}>
      <Container fluid>
        <div className={styles.homepage}>
          <h1 className={styles.title + ' ' + styles.coursetable_logo}>
            <Logo />
          </h1>
          <Form className={styles.search_bar_container} onSubmit={searched}>
            <InputGroup>
              <Form.Control
                className={styles.search_bar}
                size="lg"
                type="text"
                placeholder="Find a class..."
                ref={input}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  variant="outline-secondary"
                  className={styles.search_btn + ' p-0'}
                  style={{ width: '50px' }}
                >
                  <Row className="m-auto justify-content-center">
                    <BsSearch size={20} className="m-auto" />
                  </Row>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <CardDeck className={styles.carddeck_container + ' mx-auto'}>
            <Card border="primary">
              <Card.Body>
                <Card.Title>Popular</Card.Title>
                <Card.Text>Popular Courses</Card.Text>
              </Card.Body>
            </Card>
            <Card border="success">
              <Card.Body>
                <Card.Title>New</Card.Title>
                <Card.Text>New Stuff</Card.Text>
              </Card.Body>
            </Card>
            <Card border="dark">
              <Card.Body>
                <Card.Title>Random</Card.Title>
                <Card.Text>I'm Feelin Lucky</Card.Text>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
      </Container>
    </div>
  );
}

export default Home;
