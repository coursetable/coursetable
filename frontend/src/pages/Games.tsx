import { useState } from 'react';
import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { GiScales, GiMagnifyingGlass, GiCalendar } from 'react-icons/gi';
import { TextComponent } from '../components/Typography';
import { suspended } from '../utilities/display';
import styles from './Games.module.css';

const CourseTableGame = suspended(
  () => import('../components/Navbar/CourseTableGame'),
);

type GameCard = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconType;
  readonly cta: string;
} & (
  | { readonly status: 'available'; readonly play: () => void }
  | { readonly status: 'comingSoon'; readonly play?: never }
);

function Games() {
  // This-or-That is a modal today; the card opens it in place rather than
  // navigating away, so it keeps behaving the way it already does
  const [showThisOrThat, setShowThisOrThat] = useState(false);

  const games: GameCard[] = [
    {
      id: 'this-or-that',
      title: 'This-or-That',
      description:
        'Two Yale courses, one question: which one has the heavier workload? Ten rounds against the course evaluations.',
      icon: GiScales,
      status: 'available',
      cta: 'Play',
      play: () => setShowThisOrThat(true),
    },
    {
      id: 'guess-the-course',
      title: 'Guess the Course',
      description:
        'Read a course description with the giveaways blanked out and name the course it belongs to.',
      icon: GiMagnifyingGlass,
      status: 'comingSoon',
      cta: 'Coming soon',
    },
    {
      id: 'schedule-scramble',
      title: 'Schedule Scramble',
      description:
        'Build the highest-rated conflict-free schedule you can before the clock runs out.',
      icon: GiCalendar,
      status: 'comingSoon',
      cta: 'Coming soon',
    },
  ];

  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.title, 'mt-5 mb-1')}>Games</h1>
      <TextComponent type="secondary">
        <p className={clsx(styles.description, 'mb-4 mx-auto')}>
          Small games built on top of the Yale course catalog. More on the way.
        </p>
      </TextComponent>

      <ul className={styles.grid}>
        {games.map((game) => {
          const Icon = game.icon;
          const comingSoon = game.status === 'comingSoon';
          return (
            <li key={game.id}>
              <div
                className={clsx(styles.card, comingSoon && styles.cardDisabled)}
              >
                <div className={styles.cardIcon} aria-hidden="true">
                  <Icon size={32} />
                </div>
                <h2 className={styles.cardTitle}>
                  {game.title}
                  {comingSoon && (
                    <span className={styles.badge}>Coming soon</span>
                  )}
                </h2>
                <TextComponent type="secondary">
                  <p className={styles.cardDescription}>{game.description}</p>
                </TextComponent>
                {comingSoon ? (
                  // Not a button: a coming-soon card is not actionable, so it
                  // stays out of the tab order entirely
                  <p className={styles.ctaPlaceholder}>{game.cta}</p>
                ) : (
                  <button
                    type="button"
                    className={clsx(styles.cta, 'btn')}
                    onClick={game.play}
                  >
                    {game.cta}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {showThisOrThat && (
        <CourseTableGame onClose={() => setShowThisOrThat(false)} />
      )}
    </div>
  );
}

export default Games;
