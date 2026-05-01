import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { workloadColormap } from '../../utilities/constants';
import { getWorkloadRatings } from '../../utilities/course';
import SkillBadge from '../SkillBadge';
import { RatingBubble, SurfaceComponent, TextComponent } from '../Typography';
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

function selectPairs(searchData: CatalogListing[]): GamePair[] {
  const pool = searchData
    .filter(
      (l) => l.school === 'YC' && getWorkloadRatings(l.course, 'stat') !== null,
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 200);

  const pairs: { a: CatalogListing; b: CatalogListing; diff: number }[] = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const wa = getWorkloadRatings(pool[i]!.course, 'stat')!;
      const wb = getWorkloadRatings(pool[j]!.course, 'stat')!;
      const diff = Math.abs(wa - wb);
      if (diff > 0) pairs.push({ a: pool[i]!, b: pool[j]!, diff });
    }
  }

  pairs.sort((x, y) => y.diff - x.diff);

  const bucketSize = Math.max(1, Math.floor(pairs.length / NUM_ROUNDS));
  return Array.from({ length: NUM_ROUNDS }, (_, i) => {
    const offset = Math.floor(Math.random() * Math.min(bucketSize, 5));
    const idx = Math.min(i * bucketSize + offset, pairs.length - 1);
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
    if (!showConfetti || !cardRef.current) return;

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

    void fire({
      ...opts,
      angle: 135,
      origin: { x: rect.left / W, y: rect.top / H },
    });
    void fire({
      ...opts,
      angle: 45,
      origin: { x: rect.right / W, y: rect.top / H },
    })?.then(() => canvas.remove());
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
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [pairs, setPairs] = useState<GamePair[]>([]);

  const hasEnoughData =
    searchData !== null &&
    searchData.filter(
      (l) => l.school === 'YC' && getWorkloadRatings(l.course, 'stat') !== null,
    ).length >= 20;

  const startGame = () => {
    const newPairs = selectPairs(searchData!);
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
    if (!hasEnoughData) {
      return (
        <div className={styles.fallbackMsg}>
          <p>Browse the catalog first to load course data.</p>
          <a href="/catalog">Go to catalog →</a>
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
        if (idx === phase.picked) 
          return phase.correct ? 'correct' : 'wrong';
        
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.overlay} onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <SurfaceComponent
        elevated
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="This-or-That game"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close game"
        >
          ×
        </button>
        {renderContent()}
      </SurfaceComponent>
    </div>
  );
}
