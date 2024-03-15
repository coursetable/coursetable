import React from 'react';
import clsx from 'clsx';
import { Card, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import { TextComponent } from '../components/Typography';
import { useTheme } from '../contexts/themeContext';

// Link Logos
import github from '../images/link-logos/github.png';
import githubDark from '../images/link-logos/github-light.png';
import linkedin from '../images/link-logos/linkedin.png';
import web from '../images/link-logos/web.png';
import webDark from '../images/link-logos/web-light.png';

// Current Member Headshots
import lz from '../images/headshots/lily-zhou.jpg';
import lh from '../images/headshots/lucas-huang.jpg';
import as from '../images/headshots/alex-schapiro.jpg';
import ae from '../images/headshots/aidan-evans.jpg';
import ml from '../images/headshots/michelle-li.jpg';
import jc from '../images/headshots/josh-chough.jpg';
import dl from '../images/headshots/deyuan-li.jpg';
import kh from '../images/headshots/kevin-hu.jpg';
import ma from '../images/headshots/murad-avliyakulov.jpg';
import ag from '../images/headshots/abhijit-gupta.jpg';
import my from '../images/headshots/max-yuan.jpg';
import sh from '../images/headshots/sidney-hirschman.jpg';
import eb from '../images/headshots/erik-boesen.jpg';
import eh from '../images/headshots/evan-hu.jpg';
import nk from '../images/headshots/nalin-khanna.jpg';
import ss from '../images/headshots/shayna-sragovicz.jpg';
import lt from '../images/headshots/leck-tang.jpg';
import az from '../images/headshots/anna-zhang.jpg';
import ls from '../images/headshots/lauren-song.jpg';
import js from '../images/headshots/josephine-shin.jpg';
import hy from '../images/headshots/harry-yu.jpg';
import px from '../images/headshots/peter-xu.jpg';
import bx from '../images/headshots/ben-xu.jpg';
import ns from '../images/headshots/neil-song.jpg';
import kt from '../images/headshots/kenny-tung.jpg';
import sc from '../images/headshots/sida-chen.jpg';

// Alumni Headshots
import hs from '../images/headshots/harshal-sheth.jpg';
import hl from '../images/headshots/hao-li.jpg';
import df from '../images/headshots/dylan-fernandez-de-lara.jpg';

type Person = {
  name: string;
  image: string;
  role: string;
  links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
};

function About() {
  const { theme } = useTheme();

  const current: Person[] = [
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
      name: 'Sida Chen',
      image: sc,
      role: 'CourseTable Co-Lead',
      links: {
        linkedin: 'https://www.linkedin.com/in/sida-joshua-chen/',
        github: 'https://github.com/Josh-Cena/',
        website: 'https://joshcena.com/',
      },
    },
    {
      name: 'Neil Song',
      image: ns,
      role: 'Backend Team Lead',
      links: {
        linkedin: 'https://www.linkedin.com/in/neil-song/',
        github: 'https://github.com/neilsong',
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
    {
      name: 'Kenny Tung',
      image: kt,
      role: 'Development',
      links: {
        linkedin: 'https://www.linkedin.com/in/tungk/',
        github: 'https://github.com/kentng01/',
        website: 'https://kenneru.netlify.app/',
      },
    },
  ];

  // Order within role categories is best guess at reverse chronological
  const alumni: Person[] = [
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
      name: 'Lucas Huang',
      image: lh,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/Quintec',
        linkedin: 'https://www.linkedin.com/in/huangl16/',
        website: 'https://quintec.github.io/',
      },
    },
    {
      name: 'Lily Zhou',
      image: lz,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/lilyzhouZYJ',
        linkedin: 'https://www.linkedin.com/in/lily-zhou-b12142146/',
      },
    },
    {
      name: 'Kevin Hu',
      image: kh,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/kevinhu',
        linkedin: 'https://www.linkedin.com/in/hukevinhu/',
        website: 'https://kevinhu.io/',
      },
    },
    {
      name: 'Josh Chough',
      image: jc,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/itsjoshthedeveloper',
        linkedin: 'https://www.linkedin.com/in/joshchough/',
      },
    },
    {
      name: 'Max Yuan',
      image: my,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/maxyuan6717',
        linkedin: 'https://www.linkedin.com/in/max-yuan-209930194/',
        website: 'https://maxyuan.io/',
      },
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
      name: 'Michelle M. Li',
      image: ml,
      role: 'Design Lead',
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
      name: 'Hao Li',
      image: hl,
      role: 'Development',
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
      name: 'Leck Tang',
      image: lt,
      role: 'Development',
    },
    {
      name: 'Shayna Sragovicz',
      image: ss,
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
      links: {
        website: 'https://sidneyhirschman.com/',
      },
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
      name: 'Anna Zhang',
      image: az,
      role: 'Design',
    },
  ];

  const logoLink = (
    link: string | undefined,
    image: string,
    imageDark: string,
    text: string,
  ) =>
    link && (
      <a href={link}>
        <img
          src={theme === 'dark' ? imageDark : image}
          alt={text}
          style={{
            width: '24px',
            paddingRight: '4px',
          }}
        />
      </a>
    );

  const createCards = (person: Person, idx: number) => (
    <div key={idx} className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
      <Card className={styles.card} style={{ height: '100%' }}>
        <Card.Img variant="top" src={person.image} alt={person.name} />
        <Card.Body className="p-3">
          <Card.Title className="mb-1">{person.name}</Card.Title>
          <Card.Text>
            <TextComponent type="secondary">{person.role}</TextComponent>
            <br />
            {logoLink(person.links?.github, github, githubDark, 'github')}
            {logoLink(person.links?.linkedin, linkedin, linkedin, 'linkedin')}
            {logoLink(person.links?.website, web, webDark, 'website')}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );

  const alumniSection = (role: string, exactMatch: boolean = false) => (
    <div>
      <h3 className="mt-3">{exactMatch ? role : `${role}s`}</h3>
      <div className="my-1">
        <Row className="mx-auto">
          {alumni
            .filter((person) =>
              exactMatch ? person.role === role : person.role.includes(role),
            )
            .map(createCards)}
        </Row>
      </div>
    </div>
  );

  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.title, 'mt-5 mb-1')}>About Us</h1>
      <TextComponent type="secondary">
        <p className={clsx(styles.aboutDescription, 'mb-3 mx-auto')}>
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
        <p className={clsx(styles.aboutDescription, 'mb-3 mx-auto')}>
          Also check out our <Link to="/faq">FAQ</Link> and{' '}
          <Link to="/releases">Release Notes</Link>.
        </p>
      </TextComponent>

      <Row className="mx-auto">
        <div className="mx-auto">
          <Link to="/joinus">
            <Button>Join Us</Button>
          </Link>
        </div>
      </Row>

      <h1 className="mt-3">Current Team</h1>

      <div className="my-3">
        <Row className="mx-auto">{current.map(createCards)}</Row>
      </div>

      <h1 className="mt-5 mb-5">CourseTable Alumni</h1>

      {alumniSection('Cofounder')}

      {alumniSection('Lead')}

      {alumniSection('Development', true)}

      {alumniSection('Design', true)}
    </div>
  );
}

export default About;
