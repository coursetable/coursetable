import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Modal } from 'react-bootstrap';
import confetti from 'canvas-confetti';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { workloadColormap } from '../../utilities/constants';
import { getWorkloadRatings } from '../../utilities/course';
import SkillBadge from '../SkillBadge';
import { RatingBubble, TextComponent } from '../Typography';
import styles from './CourseTableGame.module.css';

const NUM_ROUNDS = 10;

type GamePair = [CatalogListing, CatalogListing];

type Phase =
  | { kind: 'intro' }
  | { kind: 'guessing'; roundIndex: number; score: number }
  | {
      kind: 'revealed';
      roundIndex: number;
      score: number;
      correct: boolean;
      picked: 0 | 1;
    }
  | { kind: 'finished'; score: number };

// Cross-listed listings share one course, so dedupe by course to avoid
// pairing a course with itself or counting it twice toward the minimum
function getEligibleListings(searchData: CatalogListing[]): CatalogListing[] {
  const seen = new Set<number>();
  return searchData.filter((l) => {
    if (l.school !== 'YC' || getWorkloadRatings(l.course, 'stat') === null)
      return false;
    if (seen.has(l.course.course_id)) return false;
    seen.add(l.course.course_id);
    return true;
  });
}

// Cards show workloads rounded to one decimal, so compare at that precision;
// otherwise e.g. 3.04 vs 2.96 would both show 3.0 but still have a "winner"
function displayedWorkload(listing: CatalogListing): number {
  return Number(getWorkloadRatings(listing.course, 'stat')!.toFixed(1));
}

// At least NUM_ROUNDS pairs with distinct displayed workloads must exist for
// selectPairs to fill every round without repeats
function hasEnoughPairs(eligible: CatalogListing[]): boolean {
  if (eligible.length < 20) return false;
  const workloads = new Set(eligible.map(displayedWorkload));
  return workloads.size >= 2;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

function selectPairs(eligible: CatalogListing[]): GamePair[] {
  const pool = shuffle(eligible).slice(0, 200);

  const pairs: { a: CatalogListing; b: CatalogListing; diff: number }[] = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      if (displayedWorkload(pool[i]!) === displayedWorkload(pool[j]!)) continue;
      const wa = getWorkloadRatings(pool[i]!.course, 'stat')!;
      const wb = getWorkloadRatings(pool[j]!.course, 'stat')!;
      pairs.push({ a: pool[i]!, b: pool[j]!, diff: Math.abs(wa - wb) });
    }
  }
  if (pairs.length < NUM_ROUNDS) return [];

  pairs.sort((x, y) => y.diff - x.diff);

  // Split the ranked pairs into NUM_ROUNDS equal buckets (easiest first) and
  // sample one pair uniformly from each, so difficulty rises every round
  const bucketSize = Math.floor(pairs.length / NUM_ROUNDS);
  return Array.from({ length: NUM_ROUNDS }, (_, i) => {
    const idx = i * bucketSize + Math.floor(Math.random() * bucketSize);
    const { a, b } = pairs[idx]!;
    return (Math.random() < 0.5 ? [a, b] : [b, a]) as GamePair;
  });
}

function CourseCard({
  listing,
  revealed,
  cardState,
  showConfetti,
  onClick,
}: {
  readonly listing: CatalogListing;
  readonly revealed: boolean;
  readonly cardState: 'default' | 'correct' | 'wrong' | 'other';
  readonly showConfetti: boolean;
  readonly onClick?: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showConfetti || !cardRef.current) return undefined;

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none';
    document.body.appendChild(canvas);

    const fire = confetti.create(canvas, { resize: true, useWorker: false });
    const rect = cardRef.current.getBoundingClientRect();

    const opts = {
      particleCount: 40,
      spread: 55,
      startVelocity: 28,
      gravity: 1.2,
      ticks: 80,
      colors: [
        '#468ff2',
        '#f2a046',
        '#63b37b',
        '#f26b8a',
        '#a46bf2',
        '#f2e046',
      ],
    };
    const W = window.innerWidth;
    const H = window.innerHeight;

    void Promise.all([
      fire({
        ...opts,
        angle: 135,
        origin: { x: rect.left / W, y: rect.top / H },
      }),
      fire({
        ...opts,
        angle: 45,
        origin: { x: rect.right / W, y: rect.top / H },
      }),
    ]).then(() => canvas.remove());

    // Stop the animation and drop the canvas if the round advances or the
    // game closes mid-burst
    return () => {
      fire.reset();
      canvas.remove();
    };
  }, [showConfetti]);

  const workloadStat = getWorkloadRatings(listing.course, 'stat');
  const workloadDisplay = getWorkloadRatings(listing.course, 'display');

  const professors = listing.course.course_professors
    .map((cp) => cp.professor.name)
    .join(', ');

  const description = listing.course.description ?? '';
  const allSkillsAreas = [...listing.course.skills, ...listing.course.areas];
  const isClickable = cardState === 'default';

  return (
    <button
      type="button"
      ref={cardRef}
      className={clsx(
        styles.courseCard,
        cardState === 'correct' && styles.correct,
        cardState === 'wrong' && styles.wrong,
        cardState === 'other' && styles.other,
      )}
      onClick={isClickable ? onClick : undefined}
      tabIndex={isClickable ? 0 : -1}
      aria-label={`Select ${listing.course.title} as having the higher workload`}
    >
      {(cardState === 'correct' || cardState === 'wrong') && (
        <div
          className={clsx(
            styles.cardBadge,
            cardState === 'correct'
              ? styles.cardBadgeCorrect
              : styles.cardBadgeWrong,
          )}
        >
          {cardState === 'correct' ? '✓' : '✗'}
        </div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{listing.course.title}</div>
        <div className={styles.cardMeta}>
          <TextComponent type="tertiary" className={styles.cardCode}>
            {listing.course_code}
          </TextComponent>
          {allSkillsAreas.map((s) => (
            <SkillBadge key={s} skill={s} />
          ))}
        </div>
        {description && (
          <div className={styles.cardDescription}>{description}</div>
        )}
        {professors && (
          <TextComponent type="tertiary" className={styles.cardProfessors}>
            {professors}
          </TextComponent>
        )}
      </div>
      <div className={styles.workloadRow}>
        <TextComponent type="tertiary" className={styles.workloadLabel}>
          Workload
        </TextComponent>
        <RatingBubble
          rating={revealed ? workloadStat : undefined}
          colorMap={workloadColormap}
          className={styles.workloadBubble}
        >
          {revealed ? workloadDisplay : '?'}
        </RatingBubble>
      </div>
    </button>
  );
}

export default function CourseTableGame({
  onClose,
}: {
  readonly onClose: () => void;
}) {
  const searchData = useStore((state) => state.searchData);
  const hasEvals = useStore((state) => Boolean(state.user?.hasEvals));
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [pairs, setPairs] = useState<GamePair[]>([]);

  const eligible = searchData ? getEligibleListings(searchData) : [];
  const hasEnoughData = hasEnoughPairs(eligible);

  const startGame = () => {
    const newPairs = selectPairs(eligible);
    setPairs(newPairs);
    setPhase({ kind: 'guessing', roundIndex: 0, score: 0 });
  };

  const handlePick = (picked: 0 | 1) => {
    if (phase.kind !== 'guessing') return;
    const { roundIndex, score } = phase;
    const pair = pairs[roundIndex]!;
    const wA = getWorkloadRatings(pair[0].course, 'stat')!;
    const wB = getWorkloadRatings(pair[1].course, 'stat')!;
    const correct = (picked === 0 && wA >= wB) || (picked === 1 && wB > wA);
    setPhase({ kind: 'revealed', roundIndex, score, correct, picked });
  };

  const handleNext = () => {
    if (phase.kind !== 'revealed') return;
    const { roundIndex, score, correct } = phase;
    const newScore = score + (correct ? 1 : 0);
    if (roundIndex === NUM_ROUNDS - 1) {
      setPhase({ kind: 'finished', score: newScore });
    } else {
      setPhase({
        kind: 'guessing',
        roundIndex: roundIndex + 1,
        score: newScore,
      });
    }
  };

  const renderContent = () => {
    // Workload ratings only come with evals, so without access the game
    // can never have enough data, no matter how much of the catalog is loaded
    if (!hasEvals) {
      return (
        <div className={styles.fallbackMsg}>
          <p>This game uses workload ratings from course evaluations.</p>
          <Link to="/challenge" onClick={onClose}>
            Complete the challenge to unlock evaluations →
          </Link>
        </div>
      );
    }
    if (!hasEnoughData) {
      return (
        <div className={styles.fallbackMsg}>
          <p>Browse the catalog first to load course data.</p>
          <Link to="/catalog" onClick={onClose}>
            Go to catalog →
          </Link>
        </div>
      );
    }
    if (phase.kind === 'intro') {
      return (
        <div className={styles.centerScreen}>
          <div className={styles.gameTitle}>This-or-That</div>
          <div className={styles.gameSubtitleSmall}>a CourseTable game</div>
          <div className={styles.gameSubtitle}>
            10 comparisons: pick the course with the higher workload rating.
            <br />
            Gets progressively harder as the game continues.
          </div>
          <button type="button" className={styles.playBtn} onClick={startGame}>
            Play
          </button>
        </div>
      );
    }
    if (phase.kind === 'guessing' || phase.kind === 'revealed') {
      const { roundIndex } = phase;
      const pair = pairs[roundIndex];
      if (!pair) return null;
      const revealed = phase.kind === 'revealed';

      const getCardState = (
        idx: 0 | 1,
      ): 'default' | 'correct' | 'wrong' | 'other' => {
        if (!revealed) return 'default';
        const wA = getWorkloadRatings(pair[0].course, 'stat')!;
        const wB = getWorkloadRatings(pair[1].course, 'stat')!;
        const higherIdx: 0 | 1 = wA >= wB ? 0 : 1;
        if (idx === phase.picked) return phase.correct ? 'correct' : 'wrong';

        return idx === higherIdx ? 'correct' : 'other';
      };

      return (
        <>
          <div className={styles.roundLabel}>
            Round {roundIndex + 1} of {NUM_ROUNDS}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((roundIndex + (revealed ? 1 : 0)) / NUM_ROUNDS) * 100}%`,
              }}
            />
          </div>
          <div className={styles.promptRow}>
            <div />
            <span className={styles.prompt}>
              Which course has a higher workload?
            </span>
            <button
              type="button"
              className={clsx(
                styles.nextBtn,
                !revealed && styles.nextBtnHidden,
              )}
              onClick={handleNext}
              tabIndex={revealed ? 0 : -1}
            >
              {roundIndex === NUM_ROUNDS - 1 ? 'See results' : 'Next →'}
            </button>
          </div>
          <div className={styles.cardsRow}>
            <CourseCard
              listing={pair[0]}
              revealed={revealed}
              cardState={getCardState(0)}
              showConfetti={revealed && phase.correct && phase.picked === 0}
              onClick={() => handlePick(0)}
            />
            <div className={styles.vsLabel}>vs</div>
            <CourseCard
              listing={pair[1]}
              revealed={revealed}
              cardState={getCardState(1)}
              showConfetti={revealed && phase.correct && phase.picked === 1}
              onClick={() => handlePick(1)}
            />
          </div>
        </>
      );
    }
    return (
      <div className={styles.centerScreen}>
        <div className={styles.gameTitle}>This-or-That</div>
        <div className={styles.gameSubtitleSmall}>game over!</div>
        <div className={styles.scoreBig}>{phase.score}</div>
        <div className={styles.scoreOf}>out of {NUM_ROUNDS}</div>
        <button type="button" className={styles.playBtn} onClick={startGame}>
          Play Again
        </button>
      </div>
    );
  };

  return (
    <Modal
      show
      onHide={onClose}
      centered
      dialogClassName={styles.dialog}
      aria-label="This-or-That game"
    >
      <Modal.Body className={styles.modalBody}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close game"
        >
          ×
        </button>
        {renderContent()}
      </Modal.Body>
    </Modal>
  );
}
