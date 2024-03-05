import React from 'react';
import { Card, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './releases.module.css';

type ReleaseNote = {
  title: string;
  summary: string;
  path: string;
  date: string;
};

const releaseNotes: ReleaseNote[] = [
  {
    title: 'Quist Release',
    summary: 'Introducing Quist: our new language for advanced queries.',
    path: '/releases/quist',
    date: '2024-02-23',
  },
  {
    title: 'Fall 2023 Release',
    summary:
      'Discover the latest features and improvements in our Fall 2023 update.',
    path: '/releases/fall23',
    date: '2024-01-21',
  },
  // Add more releases here
];

// Sort release notes by date, newest first
releaseNotes.sort((a, b) => b.date.localeCompare(a.date));

function ReleaseNotes() {
  return (
    <Container className={styles.container}>
      <h1 className={styles.title}>Release Notes</h1>
      <Row>
        {releaseNotes.map((note, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <Card className={styles.card}>
              <Card.Body>
                <Card.Title>{note.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {note.date}
                </Card.Subtitle>
                <Card.Text>{note.summary}</Card.Text>
                <Link
                  to={note.path}
                  className="stretched-link"
                  aria-label={`Read more about the ${note.title}`}
                />
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </Container>
  );
}

export default ReleaseNotes;
