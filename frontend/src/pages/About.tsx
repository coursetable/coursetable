import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Card, Row } from 'react-bootstrap';
import { TextComponent } from '../components/Typography';

// Member headshots
import ag from '../images/headshots/abhijit-gupta.jpg';
import ae from '../images/headshots/aidan-evans.jpg';
import as from '../images/headshots/alex-schapiro.jpg';
import az from '../images/headshots/anna-zhang.jpg';
import ash from '../images/headshots/aryan-sharma.jpg';
import bx from '../images/headshots/ben-xu.jpg';
import dl from '../images/headshots/deyuan-li.jpg';
import df from '../images/headshots/dylan-fernandez-de-lara.jpg';
import eboug from '../images/headshots/eli-bouganim.jpg';
import eb from '../images/headshots/erik-boesen.jpg';
import eh from '../images/headshots/evan-hu.jpg';
import ff from '../images/headshots/filippo-fonseca.jpg';
import hl from '../images/headshots/hao-li.jpg';
import hy from '../images/headshots/harry-yu.jpg';
import hs from '../images/headshots/harshal-sheth.jpg';
import hx from '../images/headshots/humphrey-xu.jpg';
import js from '../images/headshots/josephine-shin.jpg';
import jc from '../images/headshots/josh-chough.jpg';
import kt from '../images/headshots/kenny-tung.jpg';
import kh from '../images/headshots/kevin-hu.jpg';
import ls from '../images/headshots/lauren-song.jpg';
import lt from '../images/headshots/leck-tang.jpg';
import lz from '../images/headshots/lily-zhou.jpg';
import lh from '../images/headshots/lucas-huang.jpg';
import my from '../images/headshots/max-yuan.jpg';
import mc from '../images/headshots/michael-canudas.jpg';
import ml from '../images/headshots/michelle-li.jpg';
import ma from '../images/headshots/murad-avliyakulov.jpg';
import nk from '../images/headshots/nalin-khanna.jpg';
import ns from '../images/headshots/neil-song.jpg';
import px from '../images/headshots/peter-xu.jpg';
import rb from '../images/headshots/reyansh-bahl.jpg';
import ss from '../images/headshots/shayna-sragovicz.jpg';
import sc from '../images/headshots/sida-chen.jpg';
import sh from '../images/headshots/sidney-hirschman.jpg';
import yf from '../images/headshots/yavin-fickel.jpg';

// Link logos
import githubDark from '../images/link-logos/github-light.png';
import github from '../images/link-logos/github.png';
import linkedin from '../images/link-logos/linkedin.png';
import webDark from '../images/link-logos/web-light.png';
import web from '../images/link-logos/web.png';
import { useStore } from '../store';
import styles from './About.module.css';

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
  const theme = useStore((state) => state.theme);

  const current: Person[] = [
    {
      name: 'Reyansh Bahl',
      image: rb,
      role: 'CourseTable Lead',
      links: {
        github: 'https://github.com/reybahl',
        linkedin: 'https://www.linkedin.com/in/reyanshbahl',
      },
    },
    {
      name: 'Neil Song',
      image: ns,
      role: 'Past Lead, Advisor',
      links: {
        linkedin: 'https://www.linkedin.com/in/neil-song/',
        github: 'https://github.com/neilsong',
      },
    },
    {
      name: 'Humphrey Xu',
      image: hx,
      role: 'Past Lead, Advisor',
      links: {
        linkedin: 'https://www.linkedin.com/in/humphrey-xu/',
        github: 'https://github.com/Etherite1',
      },
    },
    {
      name: 'Alex Schapiro',
      image: as,
      role: 'Past Lead, Advisor',
      links: {
        github: 'https://github.com/bearsyankees',
        linkedin: 'https://www.linkedin.com/in/aschap/',
        website: 'https://alexschapiro.com/',
      },
    },
    {
      name: 'Sida Chen',
      image: sc,
      role: 'Past Lead, Advisor',
      links: {
        linkedin: 'https://www.linkedin.com/in/sida-joshua-chen/',
        github: 'https://github.com/Josh-Cena/',
        website: 'https://joshcena.com/',
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
    {
      name: 'Filippo Fonseca',
      image: ff,
      role: 'Development',
      links: {
        github: 'https://github.com/filippo-fonseca',
        linkedin: 'https://www.linkedin.com/in/filippo-fonseca/',
        website: 'https://filippofonseca.com/',
      },
    },
    {
      name: 'Michael Canudas',
      image: mc,
      role: 'Development',
      links: {
        github: 'https://github.com/michaelcanudas',
        linkedin: 'https://www.linkedin.com/in/michaelcanudas/',
        website: 'https://michaelcanudas.com/',
      },
    },
    {
      name: 'Aryan Sharma',
      image: ash,
      role: 'Development',
      links: {
        github: 'https://github.com/aryans-15',
        linkedin: 'https://www.linkedin.com/in/aryans15/',
        website: 'https://aryans.dev/',
      },
    },
    {
      name: 'Yavin Fickel',
      image: yf,
      role: 'Development',
      links: {
        website: 'https://yavinfickel.com',
        github: 'https://github.com/yav-fi',
        linkedin: 'https://www.linkedin.com/in/yavin',
      },
    },
    {
      name: 'Eli Bouganim',
      image: eboug,
      role: 'Development',
      links: {
        website: 'https://elibouganim.web.app',
        github: 'https://github.com/eliboug',
        linkedin: 'https://www.linkedin.com/in/eli-bouganim/',
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
      <Card className={styles.card}>
        <Card.Img
          variant="top"
          src={person.image}
          alt={person.name}
          style={{ height: '100%' }}
        />
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
      <h1 className={clsx(styles.title, 'mt-5 mb-1')}>About us</h1>
      <TextComponent type="secondary">
        <p className={clsx(styles.aboutDescription, 'mb-3 mx-auto')}>
          CourseTable offers a clean and effective way for Yale students to find
          the courses they want, bringing together course information, student
          evaluations, and course demand statistics in an intuitive interface.
          It's run by a small team of volunteers within the{' '}
          <a
            href="http://yalecomputersociety.org/"
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
          <Link to="/releases">Release notes</Link>.
        </p>
      </TextComponent>

      <div className="d-flex justify-content-center">
        <Link className="btn" to="/joinus">
          Join us
        </Link>
      </div>

      <h1 className="mt-3">Current team</h1>

      <div className="my-3">
        <Row className="mx-auto">{current.map(createCards)}</Row>
      </div>

      <h1 className="mt-5 mb-5">CourseTable alumni</h1>

      {alumniSection('Cofounder')}

      {alumniSection('Lead')}

      {alumniSection('Development', true)}

      {alumniSection('Design', true)}
    </div>
  );
}

export default About;
