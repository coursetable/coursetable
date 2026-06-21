import React from 'react';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsCalendar3, BsPeopleFill } from 'react-icons/bs';
import {
  FaFlask,
  FaFutbol,
  FaGraduationCap,
  FaSmile,
  FaUtensils,
} from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';
import { useComponentVisible } from '../../utilities/display';
import { SurfaceComponent } from '../Typography';
import styles from './AppsDropdown.module.css';

interface AppLink {
  readonly name: string;
  readonly icon?: IconType;
  readonly image?: string;
  readonly color: string;
}

const apps: readonly AppLink[] = [
  {
    name: 'CourseTable',
    image: '/icon200x200.png',
    color: '#468ff2',
  },
  {
    name: 'Yalies',
    icon: BsPeopleFill,
    color: '#28639b',
  },
  {
    name: 'Yale Clubs',
    icon: HiUserGroup,
    color: '#438fd1',
  },
  {
    name: 'y/meets',
    icon: BsCalendar3,
    color: '#468ff2',
  },
  {
    name: 'Yale IMs',
    icon: FaFutbol,
    color: '#e2ad16',
  },
  {
    name: 'y/labs',
    icon: FaFlask,
    color: '#1678d3',
  },
  {
    name: 'Yale Meals',
    icon: FaUtensils,
    color: '#164b78',
  },
  {
    name: 'MajorAudit',
    icon: FaGraduationCap,
    color: '#d94c3d',
  },
  {
    name: 'YaleMoji',
    icon: FaSmile,
    color: '#141414',
  },
];

function AppTile({ app }: { readonly app: AppLink }) {
  const Icon = app.icon;
  return (
    <div className={styles.appTile}>
      <span className={styles.appIcon} style={{ color: app.color }}>
        {app.image ? (
          <img src={app.image} alt="" />
        ) : (
          Icon && <Icon aria-hidden size={34} />
        )}
      </span>
      <span>{app.name}</span>
    </div>
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
                <AppTile key={app.name} app={app} />
              ))}
            </div>
            <p className={styles.attribution}>CourseTable is a y/cs product</p>
          </div>
        </Collapse>
      </SurfaceComponent>
    </div>
  );
}
