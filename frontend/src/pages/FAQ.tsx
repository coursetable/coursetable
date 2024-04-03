import React, { useContext, useEffect } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { FaChevronRight } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { HoverText, TextComponent } from '../components/Typography';
import styles from './FAQ.module.css';
import { scrollToTop } from '../utilities/display';

function ContextAwareToggle({ question }: { readonly question: string }) {
  const currentEventKey = useContext(AccordionContext);
  const navigate = useNavigate();
  const decoratedOnClick = useAccordionToggle(question, () => {
    navigate(`#${toId(question)}`);
  });
  const isCurrentEventKey = currentEventKey === question;

  return (
    <HoverText
      className={clsx(
        isCurrentEventKey && 'active',
        'd-flex justify-content-between py-3 px-3',
        styles.accordionHoverHeader,
      )}
      id={toId(question)}
      onClick={decoratedOnClick}
    >
      {question}
      <FaChevronRight
        // Rotate arrow when active
        className={clsx(
          isCurrentEventKey && styles.accordionArrowActive,
          'my-auto',
          styles.accordionArrow,
        )}
      />
    </HoverText>
  );
}

const faqs = [
  {
    section: 'About us',
    items: [
      {
        title: 'What is CourseTable?',
        contents: (
          <>
            CourseTable offers a clean and effective way for Yale students to
            find the courses they want, bringing together course information,
            student evaluations, and course demand statistics in an intuitive
            interface.
          </>
        ),
      },
      {
        title: 'Who runs CourseTable?',
        contents: (
          <>
            CourseTable is run by a small{' '}
            <NavLink to="/about" onClick={scrollToTop}>
              team
            </NavLink>{' '}
            of volunteers within the Yale Computer Society.{' '}
            <strong>
              CourseTable is not affiliated with Yale University officials.
            </strong>
          </>
        ),
      },
      {
        title: 'What is the history of CourseTable?',
        contents: (
          <>
            <p>
              CourseTable was created in 2012 by Peter Xu (Yale MC '14) and
              Harry Yu (Yale SY '14).
            </p>
            <p>
              In 2014,{' '}
              <a
                href="https://web.archive.org/web/20210224091423/https://www.nytimes.com/2014/01/22/nyregion/yale-students-tangle-with-university-over-yale-blue-book-website.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yale unceremoniously blocked it from campus networks.
              </a>{' '}
              After significant internal and external pressure, these
              restrictions were removed.
            </p>
            <p>
              In the fall of 2019, the Yale Computer Society{' '}
              <a
                href="https://yaledailynews.com/blog/2019/09/18/coursetable-taken-over-by-computer-society/"
                target="_blank"
                rel="noopener noreferrer"
              >
                took over
              </a>{' '}
              maintenance and development of CourseTable.
            </p>
            <p>
              Over the summer of 2020, we rebuilt CourseTable as a modern site
              that will be easier to update and maintain going forward. If we're
              missing a feature from the old site that you would like to see
              added back, please{' '}
              <a href="https://feedback.coursetable.com">let us know</a>.
            </p>
          </>
        ),
      },
    ],
  },
  {
    section: 'Using CourseTable',
    items: [
      {
        title: 'Who can use CourseTable?',
        contents: (
          <>
            Anyone can use CourseTable! However, we do require you to log in
            with your Yale ID to use all of our features such as course ratings
            and worksheets.
          </>
        ),
      },
      {
        title: 'Where can I submit feedback or report bugs?',
        contents: (
          <>
            If you have a suggestion or find a bug, please submit our{' '}
            <a href="https://feedback.coursetable.com">general feedback form</a>
            . We'll be in touch as soon as possible.
          </>
        ),
      },
      {
        title: 'How should I interpret course statistics?',
        contents: (
          <>
            <p>A couple of disclaimers:</p>
            <ul>
              <li>
                Evaluations are not everything! Professors' personalities and
                teaching styles are often divisive, and you will likely enjoy a
                class up your alley more than the random, most-highly evaluated
                class.
              </li>
              <li>
                Sophomores and freshmen: keep in mind highly-evaluated seminars
                are often filled to the brim.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: 'How can I contribute?',
        contents: (
          <>
            The CourseTable website is open-source and available at our{' '}
            <a
              href="https://github.com/coursetable/coursetable"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            . If you'd like to join the team, check out our{' '}
            <NavLink to="/joinus" onClick={scrollToTop}>
              application
            </NavLink>
            !
          </>
        ),
      },
      {
        title: 'Do you have a privacy policy?',
        contents: (
          <>
            You can find our privacy policy{' '}
            <NavLink to="/privacypolicy" onClick={scrollToTop}>
              here
            </NavLink>
            .
          </>
        ),
      },
    ],
  },
  {
    section: 'About our data',
    items: [
      {
        title: 'Where does CourseTable get the data?',
        contents: (
          <>
            We source our data from a combination of Yale's{' '}
            <a
              href="https://courses.yale.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              course catalog
            </a>
            ,{' '}
            <a
              href="https://oce.app.yale.edu/ocedashboard/studentViewer"
              target="_blank"
              rel="noopener noreferrer"
            >
              historical evaluations database
            </a>
            , and{' '}
            <a
              href="https://ivy.yale.edu/course-stats/"
              target="_blank"
              rel="noopener noreferrer"
            >
              course demand portal
            </a>
            . Some of the information is also pulled from our historical
            archives of the aforementioned data sources.
          </>
        ),
      },
      {
        title: 'How often is CourseTable updated?',
        contents: (
          <>
            We update our database every day around 3:30am EST. If anything
            continues to not match Yale's catalog after a few days, please let
            us know through our{' '}
            <a href="https://feedback.coursetable.com">feedback form</a>.
          </>
        ),
      },
      {
        title: 'How do I report a data error?',
        contents: (
          <>
            <p>
              First, make sure there is an <b>inconsistency</b> between
              CourseTable and the Yale Course Search. If you believe that the
              data on YCS is wrong too, you should report to the professor
              and/or department to get it fixed on YCS, and CourseTable will
              automatically update.
            </p>
            <p>
              Then, make sure to give up to 24 hours for new changes on YCS to
              take effect on CourseTable.
            </p>
            <p>
              After doing the above, you can let us know through our{' '}
              <a href="https://feedback.coursetable.com">feedback form</a>.
            </p>
          </>
        ),
      },
      {
        title: "Can I use CourseTable's data for a project?",
        contents: (
          <>
            Sure. Here are some caveats:
            <ul>
              <li>
                We don't claim ownership over any data because they are all
                sourced from Yale websites. You could have scraped the data
                yourself.
              </li>
              <li>
                Yale University has the right to final interpretation of how the
                data should be used in accordance with University rules. For
                example, course evaluations should not be publicly displayed.
              </li>
              <li>
                You don't have to ask us to have access to the data. As a signed
                in user, you can directly use the{' '}
                <NavLink to="/graphiql">GraphQL playground</NavLink> to query
                the data.
              </li>
            </ul>
            However, we do appreciate it if you could{' '}
            <a href="mailto:coursetable.at.yale@gmail.com">shoot us an email</a>{' '}
            with a brief description of your project, so we can keep in touch
            and understand how we may help.
          </>
        ),
      },
      {
        title: 'How are the ratings calculated?',
        contents: (
          <>
            <p>
              We first merge evaluations across the different cross-listings of
              a course. Once we've done this, we compute average overall ratings
              and workloads for each instance of a course, where different
              semesters or sections constitute different instances.
            </p>
            <p>
              The class ratings are an average of the average overall rating for
              every instance of a course code in our database. Similarly, the
              workload rating is an average of the average workload ratings. If
              a class has multiple sections, each section goes into this average
              as a separate number. If the class is cross-listed under multiple
              course codes, any match course code is included in the
              computation.
            </p>
            <p>
              The professor rating is an average of the average overall rating
              for every course which a professor has taught. A course is
              included in this calculation even if it was co-taught with other
              professor(s).
            </p>
            <p>
              We have course evaluation data going back to 2009. All of this
              data is included in the ratings calculations.
            </p>
          </>
        ),
      },
    ],
  },
];

function toId(title: string): string {
  return title
    .replaceAll(' ', '_')
    .replace(/[^a-z_]/giu, '')
    .toLowerCase();
}

function FAQ() {
  const location = useLocation();
  const id = location.hash.slice(1);
  useEffect(() => {
    if (id) {
      const element = document.getElementById(id);
      if (!element || element.offsetTop < window.scrollY) return;
      element.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [id]);
  return (
    <div className={clsx('mx-auto', styles.container)}>
      <h1 className={clsx(styles.faqHeader, 'mt-5 mb-1')}>
        Frequently Asked Questions
      </h1>
      <p className={clsx(styles.faqDescription, 'mb-3')}>
        <TextComponent type="secondary">Have another question?</TextComponent>{' '}
        <a href="https://feedback.coursetable.com">Contact us</a>.
      </p>
      {faqs.map((section) => (
        <React.Fragment key={section.section}>
          <h2 className="my-4">{section.section}</h2>
          <Accordion
            defaultActiveKey={
              id && section.items.find((faq) => toId(faq.title) === id)?.title
            }
          >
            {section.items.map((faq) => (
              <Card className={styles.card} key={faq.title}>
                <div>
                  <ContextAwareToggle question={faq.title} />
                </div>
                <Accordion.Collapse eventKey={faq.title}>
                  <Card.Body className="py-3">
                    <TextComponent type="secondary">
                      {faq.contents}
                    </TextComponent>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </React.Fragment>
      ))}
    </div>
  );
}

export default FAQ;
