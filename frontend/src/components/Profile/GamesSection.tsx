import { useState } from 'react';
import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { GiScales, GiHourglass } from 'react-icons/gi';
import { suspended } from '../../utilities/display';
import { TextComponent } from '../Typography';
import styles from './GamesSection.module.css';

const CourseTableGame = suspended(() => import('../Navbar/CourseTableGame'));

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

export default function GamesSection() {
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
    <>
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
                  <Icon size={24} />
                </div>
                <h4 className={styles.cardTitle}>{game.title}</h4>
                <TextComponent type="secondary">
                  <p className={styles.cardDescription}>{game.description}</p>
                </TextComponent>
                {comingSoon ? (
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
    </>
  );
}
