import React from 'react';
import { CardDeck, Card, Container } from 'react-bootstrap';
import Logo from '../components/Logo';
import Searchbar from '../components/Searchbar';
import styles from './Home.module.css';

/**
 * Renders the Home page
 */

function Home() {
  return (
    <div className={styles.container}>
      <Container fluid>
        <div className={styles.homepage}>
          <h1 className={styles.title + ' ' + styles.coursetable_logo}>
            <Logo />
          </h1>
          <div className={styles.search_bar_container}>
            <Searchbar bar_size="lg" />
          </div>
          <CardDeck className={styles.carddeck_container + ' mx-auto'}>
            <Card border="primary">
              <Card.Body>
                <Card.Title>Most Popular</Card.Title>
                <Card.Text>Definitely not CPSC 323</Card.Text>
              </Card.Body>
            </Card>
            <Card border="success">
              <Card.Body>
                <Card.Title>What's New?</Card.Title>
                <Card.Text>Literally Everything.</Card.Text>
              </Card.Body>
            </Card>
            <Card border="dark">
              <Card.Body>
                <Card.Title>Surprise Me</Card.Title>
                <Card.Text>A humanities course for a change</Card.Text>
              </Card.Body>
            </Card>
          </CardDeck>
        </div>
      </Container>
    </div>
  );
}

export default Home;
