import { useState } from 'react';
import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { GiScales, GiConsoleController, GiHourglass } from 'react-icons/gi';
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
        'Two Yale courses, one question: which one has the heavier workload? Play ten rounds against course evaluations.',
      icon: GiScales,
      status: 'available',
      cta: 'Play',
      play: () => setShowThisOrThat(true),
    },
    // Deliberately unnamed placeholders: nothing is announced yet, so these
    // slots say "coming soon" and nothing more
    {
      id: 'placeholder-1',
      title: 'Coming soon',
      description: 'Come back soon for more games!',
      icon: GiHourglass,
      status: 'comingSoon',
      cta: 'Not yet available',
    },
    {
      id: 'placeholder-2',
      title: 'Coming soon',
      description: 'Come back soon for more games!',
      icon: GiHourglass,
      status: 'comingSoon',
      cta: 'Not yet available',
    },
  ];

  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.title, 'mt-5 mb-4')}>
        <GiConsoleController
          className={styles.titleIcon}
          size={30}
          aria-hidden="true"
        />
        Games
      </h1>

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
                <h2 className={styles.cardTitle}>{game.title}</h2>
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
                    className={clsx(styles.cta, 'btn btn-primary')}
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
