import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Container } from 'react-bootstrap';

import Logo from './Navbar/Logo';
import { TextComponent } from './Typography';
import VercelBanner from '../images/powered-by-vercel.svg';
import { scrollToTop } from '../utilities/display';
import { createCatalogLink } from '../utilities/navigation';
import styles from './Footer.module.css';

const links = [
  {
    section: 'Explore',
    items: [
      { name: 'Catalog', to: createCatalogLink() },
      { name: 'Worksheet', to: '/worksheet' },
    ],
  },
  {
    section: 'Support',
    items: [
      { name: 'FAQ', to: '/faq' },
      { name: 'Feedback', to: 'https://feedback.coursetable.com/' },
      { name: 'Status', to: 'https://stats.uptimerobot.com/NpVA5UNlX3' },
      { name: 'Privacy Policy', to: '/privacypolicy' },
    ],
  },
  {
    section: 'Developers',
    items: [{ name: 'GraphQL playground', to: '/graphiql' }],
  },
  {
    section: 'About',
    items: [
      { name: 'Team', to: '/about' },
      { name: 'Release Notes', to: '/releases' },
      { name: 'Join Us', to: '/joinus' },
      { name: 'GitHub', to: 'https://github.com/coursetable' },
      { name: 'LinkedIn', to: 'https://www.linkedin.com/company/coursetable/' },
    ],
  },
];

function Footer() {
  return (
    <Container fluid>
      <footer className={clsx(styles.footer, 'py-5 px-5')}>
        <div className="row">
          <div className="col-12 col-md">
            <span className={styles.footerLogo}>
              <Logo icon={false} />
            </span>
            <small className="d-block mb-3">
              &copy; {new Date().getFullYear()}
            </small>

            <a href="https://vercel.com/?utm_source=coursetable&utm_campaign=oss">
              <img
                style={{ height: '2.5rem' }}
                src={VercelBanner}
                alt="Powered by Vercel"
              />
            </a>
            <div className="mt-3">
              <a href="https://www.buymeacoffee.com/coursetable">
                <img
                  style={{ height: '2.5rem' }}
                  src="https://img.buymeacoffee.com/button-api/?text=Buy us a textbook&emoji=📘&slug=coursetable&button_colour=1084ff&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=FFDD00"
                  alt="Buy us a textbook"
                />
              </a>
            </div>
          </div>
          {links.map(({ section, items }) => (
            <div key={section} className="col-6 col-md">
              <h5 className={styles.sectionHeading}>{section}</h5>
              <ul className="list-unstyled text-small">
                {items.map(({ name, to }) => (
                  <li key={name}>
                    {to.startsWith('https:') ? (
                      <a href={to} rel="noopener noreferrer" target="_blank">
                        <TextComponent type="secondary">{name}</TextComponent>
                      </a>
                    ) : (
                      <NavLink to={to} onClick={scrollToTop}>
                        <TextComponent type="secondary">{name}</TextComponent>
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </Container>
  );
}

export default Footer;
