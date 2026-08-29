import React from 'react';
import { Collapse } from 'react-bootstrap';
import coursetableLogo from '../../images/apps-panel/coursetable.svg';
import yaleMenusLogo from '../../images/apps-panel/yale-menus.png';
import yaleImsLogo from '../../images/apps-panel/yaleims.png';
import yaliesLogo from '../../images/apps-panel/yalies.png';
import yaleClubsLogo from '../../images/apps-panel/yclubs.svg';
import yLabsLogo from '../../images/apps-panel/ylabs.png';
import yMeetsLogo from '../../images/apps-panel/ymeetslogo.png';
import { useComponentVisible } from '../../utilities/display';
import { SurfaceComponent } from '../Typography';
import styles from './AppsDropdown.module.css';

interface AppLink {
  readonly name: string;
  readonly href: string;
  readonly image: string;
  readonly imageShift?: 'up' | 'upMore';
  readonly imageSize?: 'large' | 'xlarge';
  readonly roundedImage?: boolean;
  readonly color: string;
}

const apps: readonly AppLink[] = [
  {
    name: 'CourseTable',
    href: 'https://coursetable.com',
    image: coursetableLogo,
    color: '#468ff2',
  },
  {
    name: 'Yalies',
    href: 'https://yalies.io',
    image: yaliesLogo,
    color: '#28639b',
  },
  {
    name: 'Yale Clubs',
    href: 'https://yaleclubs.io',
    image: yaleClubsLogo,
    color: '#438fd1',
  },
  {
    name: 'y/meets',
    href: 'https://ymeets.com',
    image: yMeetsLogo,
    roundedImage: true,
    color: '#468ff2',
  },
  {
    name: 'Yale IMs',
    href: 'https://yaleims.com',
    image: yaleImsLogo,
    imageShift: 'up',
    color: '#e2ad16',
  },
  {
    name: 'y/labs',
    href: 'https://yalelabs.io',
    image: yLabsLogo,
    imageShift: 'up',
    color: '#1678d3',
  },
  {
    name: 'Yale Meals',
    href: 'https://apps.apple.com/us/app/yalemeals/id6755962674',
    image: yaleMenusLogo,
    imageShift: 'upMore',
    imageSize: 'xlarge',
    color: '#164b78',
  },
];

function normalizeHostname(hostname: string) {
  return hostname.replace(/^www\./u, '');
}

function AppTile({
  app,
  onClose,
}: {
  readonly app: AppLink;
  readonly onClose: () => void;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetUrl = new URL(app.href);
    if (
      normalizeHostname(window.location.hostname) ===
      normalizeHostname(targetUrl.hostname)
    ) {
      event.preventDefault();
      onClose();
      window.location.assign(targetUrl.origin);
      return;
    }
    onClose();
  };

  return (
    <a
      className={styles.appTile}
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      <span className={styles.appIcon} style={{ color: app.color }}>
        <img
          src={app.image}
          alt=""
          className={
            [
              app.imageShift === 'upMore'
                ? styles.appIconImgUpMore
                : app.imageShift === 'up'
                  ? styles.appIconImgUp
                  : undefined,
              app.imageSize === 'xlarge'
                ? styles.appIconImgXLarge
                : app.imageSize === 'large'
                  ? styles.appIconImgLarge
                  : undefined,
              app.roundedImage ? styles.appIconImgRounded : undefined,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
        />
      </span>
      <span>{app.name}</span>
    </a>
  );
}

export default function AppsDropdown() {
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLDivElement>(false);

  return (
    <div ref={elemRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        aria-label="Yale apps"
        aria-expanded={isComponentVisible}
      >
        <span className={styles.waffle} aria-hidden>
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} />
          ))}
        </span>
      </button>
      <SurfaceComponent elevated className={styles.dropdown}>
        <Collapse in={isComponentVisible}>
          <div>
            <div className={styles.appGrid}>
              {apps.map((app) => (
                <AppTile
                  key={app.name}
                  app={app}
                  onClose={() => setIsComponentVisible(false)}
                />
              ))}
            </div>
            <p className={styles.attribution}>
              CourseTable is a{' '}
              <a
                href="https://yalecomputersociety.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                y/cs
              </a>{' '}
              product
            </p>
          </div>
        </Collapse>
      </SurfaceComponent>
    </div>
  );
}
