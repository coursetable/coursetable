import React from 'react';

import styled, { useTheme } from 'styled-components';
import { Card, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import { TextComponent, StyledCard } from '../components/StyledComponents';

// Link Logos
import github from '../images/headshots/link-logos/github.png';
import github_dark from '../images/headshots/link-logos/github-light.png';
import linkedin from '../images/headshots/link-logos/linkedin.png';
import web from '../images/headshots/link-logos/web.png';
import web_dark from '../images/headshots/link-logos/web-light.png';

// Current Member Headshots
import lz from '../images/headshots/lily-zhou.jpg';
import lh from '../images/headshots/lucas-huang.jpg';
import as from '../images/headshots/alex-schapiro.png';
import ae from '../images/headshots/aidan-evans.jpg';
import ml from '../images/headshots/michelle-li.jpg';
import jc from '../images/headshots/josh-chough.jpg';
import dl from '../images/headshots/deyuan-li.jpg';
import kh from '../images/headshots/kevin-hu.jpg';
import ma from '../images/headshots/murad-avliyakulov.jpg';
import ag from '../images/headshots/abhijit-gupta.jpg';
import my from '../images/headshots/max-yuan.jpg';
import sh from '../images/headshots/sidney-hirschman.jpeg';
import eb from '../images/headshots/erik-boesen.jpg';
import eh from '../images/headshots/evan-hu.jpg';
import nk from '../images/headshots/nalin-khanna.jpg';
import ss from '../images/headshots/shayna-sragovicz.jpg';
import lt from '../images/headshots/leck-tang.jpg';
import az from '../images/headshots/anna-zhang.jpg';
import ls from '../images/headshots/lauren-song.jpg';
import js from '../images/headshots/josephine-shin.jpg';
import hy from '../images/headshots/harry-yu.jpg';
import px from '../images/headshots/peter-xu.png';
import bx from '../images/headshots/ben-xu.png';

// Alumni Headshots
import hs from '../images/headshots/harshal-sheth.jpg';
import hl from '../images/headshots/hao-li.jpg';
import df from '../images/headshots/dylan-fernandez-de-lara.jpg';

// import generic from '../images/headshots/default_pfp.png';

// Header
const StyledH1 = styled.h1`
  font-weight: 600;
  font-size: 25px;
  text-align: center;
  transition: color ${({ theme }) => theme.trans_dur};
`;

/**
 * Renders the about us page
 */
const Friends: React.VFC = () => {
  const theme = useTheme();

  const current = [
    {
      name: 'Alex Schapiro',
      image: as,
      role: 'CourseTable Co-Lead',
      links: {
        github: 'https://github.com/bearsyankees',
        linkedin: 'https://www.linkedin.com/in/aschap/',
      },
    },
    {
      name: 'Lucas Huang',
      image: lh,
      role: 'CourseTable Co-Lead',
      links: {
        github: 'https://github.com/Quintec',
        linkedin: 'https://www.linkedin.com/in/huangl16/',
        website: 'https://quintec.github.io/',
      },
    },
    {
      name: 'Lily Zhou',
      image: lz,
      role: 'Former Lead',
      links: {
        github: 'https://github.com/lilyzhouZYJ',
        linkedin: 'https://www.linkedin.com/in/lily-zhou-b12142146/',
      },
    },
    {
      name: 'Kevin Hu',
      image: kh,
      role: 'Former Lead',
      links: {
        github: 'https://github.com/kevinhu',
        linkedin: 'https://www.linkedin.com/in/hukevinhu/',
        website: 'https://kevinhu.io/',
      },
    },
    {
      name: 'Josh Chough',
      image: jc,
      role: 'Former Lead',
      links: {
        github: 'https://github.com/itsjoshthedeveloper',
        linkedin: 'https://www.linkedin.com/in/joshchough/',
      },
    },
    {
      name: 'Max Yuan',
      image: my,
      role: 'Former Lead',
      links: {
        github: 'https://github.com/maxyuan6717',
        linkedin: 'https://www.linkedin.com/in/max-yuan-209930194/',
        website: 'https://maxyuan.io/',
      },
    },
    {
      name: 'Erik Boesen',
      image: eb,
      role: 'Development',
      links: {
        website: 'https://erikboesen.com',
      },
    },
    {
      name: 'Ben Xu',
      image: bx,
      role: 'Development',
      links: {
        linkedin: 'https://www.linkedin.com/in/ben-xu-6323ab258/',
        github: 'https://github.com/benzuzu',
      },
    },
  ];

  const alumni = [
    {
      name: 'Peter Xu',
      image: px,
      role: 'Cofounder',
    },
    {
      name: 'Harry Yu',
      image: hy,
      role: 'Cofounder',
    },
    {
      name: 'Harshal Sheth',
      image: hs,
      role: 'CourseTable Lead',
      links: {
        website: 'https://harshal.sheth.io',
        linkedin: 'https://linkedin.com/in/hsheth2',
        github: 'https://github.com/hsheth2',
      },
    },
    {
      name: 'Hao Li',
      image: hl,
      role: 'Development',
    },
    {
      name: 'Dylan Fernandez de Lara',
      image: df,
      role: 'Design',
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
      name: 'Sidney Hirschman',
      image: sh,
      role: 'Design',
      links: {
        website: 'https://sidneyhirschman.com/',
      },
    },
    {
      name: 'Aidan Evans',
      image: ae,
      role: 'Development',
      links: {
        github: 'https://github.com/nsnave',
        linkedin: 'https://www.linkedin.com/in/aidantevans/',
        website: 'https://www.aidantevans.com/',
      },
    },
    {
      name: 'Deyuan Li',
      image: dl,
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

  const logo_link = (link: any, image: any, image_dark: any, text: string) => (
    <>
      {link && (
        <a href={link}>
          <img
            src={theme.theme === 'dark' ? image_dark : image}
            alt={text}
            style={{
              width: '24px',
              paddingRight: '4px',
            }}
          />
        </a>
      )}
    </>
  );

  const create_cards = (person: any, idx: any) => (
    <div key={idx} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
      <StyledCard style={{ height: '100%' }}>
        <Card.Img variant="top" src={person.image} alt={person.name} />
        <Card.Body className="p-3">
          <Card.Title className="mb-1">{person.name}</Card.Title>
          <Card.Text>
            <TextComponent type={1}>{person.role}</TextComponent>
            <br />
            {logo_link(person.links?.github, github, github_dark, 'github')}
            {logo_link(person.links?.linkedin, linkedin, linkedin, 'linkedin')}
            {logo_link(person.links?.website, web, web_dark, 'website')}
          </Card.Text>
        </Card.Body>
      </StyledCard>
    </div>
  );

  return (
    <div className={`${styles.container} mx-auto`}>
      <StyledH1 className={'mt-5 mb-1'}>About Us</StyledH1>
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

export default Friends;