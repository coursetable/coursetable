import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { OverlayTrigger, Tab, Tabs, Tooltip } from 'react-bootstrap';
import { HiSparkles } from 'react-icons/hi2';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import Mark from 'mark.js';
import type { SearchEvaluationNarrativesQuery } from '../../../generated/graphql-types';
import { evalQuestionTags } from '../../../utilities/constants';
import { truncatedText } from '../../../utilities/course';
import { Input, LinkLikeText, TextComponent } from '../../Typography';
import styles from './EvaluationResponses.module.css';

function CommentRows({
  responses,
  filter,
}: {
  readonly responses: string[];
  readonly filter: string;
}) {
  if (responses.length === 0) return [];
  const filteredResps = responses
    .filter((response) => response.toLowerCase().includes(filter.toLowerCase()))
    .map((response, index) => (
      // .responses is used for highlighting
      <div key={index} className={clsx(styles.commentRow, 'responses')}>
        <TextComponent type="secondary">{response}</TextComponent>
      </div>
    ));
  if (filteredResps.length === 0) {
    return [
      <div key={0} className={styles.commentRow}>
        <TextComponent type="secondary">No matches found.</TextComponent>
      </div>,
    ];
  }
  return filteredResps;
}

function AiSummary({ text }: { readonly text: string }) {
  const [expanded, setExpanded] = useState(true);
  const [clamped, setClamped] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const summaryBodyId = useId();

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return undefined;
    // Measure against the clamped state so we know whether the summary is
    // long enough to warrant a toggle. When expanded, the element grows to
    // fit its content (scrollHeight === clientHeight), so we temporarily
    // apply the clamp class to measure overflow.
    const measure = () => {
      if (expanded) {
        el.classList.add(styles.summaryClamped);
        const overflowing = el.scrollHeight > el.clientHeight;
        el.classList.remove(styles.summaryClamped);
        setClamped(overflowing);
      } else {
        setClamped(el.scrollHeight > el.clientHeight);
      }
    };
    measure();
    // Tab panes render with display: none until their tab is active, so the
    // initial measurement reads 0 for every inactive pane. A ResizeObserver
    // re-runs measurement when the element transitions from 0×0 (hidden) to
    // its real size, and on any subsequent layout changes.
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryHeader}>
        <HiSparkles className={styles.summaryIcon} aria-hidden />
        <span className={styles.summaryLabel}>AI Summary</span>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={tooltipId}>
              Generated from student comments — may be imperfect.
            </Tooltip>
          }
        >
          <button
            type="button"
            className={styles.summaryInfo}
            aria-label="About AI summaries"
          >
            <MdInfoOutline aria-hidden />
          </button>
        </OverlayTrigger>
      </div>
      <div
        id={summaryBodyId}
        ref={bodyRef}
        className={clsx(styles.summaryBody, !expanded && styles.summaryClamped)}
      >
        <TextComponent type="secondary">{text}</TextComponent>
      </div>
      {clamped && (
        <div className={styles.summaryToggle}>
          <LinkLikeText
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? 'Show less' : 'Show more'}
            aria-expanded={expanded}
            aria-controls={summaryBodyId}
            aria-label={
              expanded
                ? 'Show less of the AI summary'
                : 'Show more of the AI summary'
            }
          >
            {expanded ? (
              <IoIosArrowUp size={18} />
            ) : (
              <IoIosArrowDown size={18} />
            )}
          </LinkLikeText>
        </div>
      )}
    </div>
  );
}

// Allow some variations in question text for the same tag, and make them
// display the same thing. These are real cooccurrences in the data.
function canonicalizeQuestionText(questionText: string) {
  if (
    questionText ===
      'What are the strengths and weaknesses of the course and how could it be improved?' ||
    questionText ===
      'Looking back on this course, what is your overall assessment of the course:  What are its strengths and weaknesses, and in what ways might it be improved?'
  )
    return 'What are the strengths and weaknesses of this course and how could it be improved?';
  if (
    questionText ===
    'How would you summarize this course for a fellow student?  Would you recommend it to another student?  Why or why not?'
  )
    return 'How would you summarize this course for a fellow student? Would you recommend this course to another student? Why or why not?';
  return questionText;
}

function EvaluationResponses({
  info,
}: {
  readonly info:
    | NonNullable<SearchEvaluationNarrativesQuery['listings_by_pk']>['course']
    | undefined;
}) {
  // Sort by original order or length?
  const [sortOrder, setSortOrder] = useState('length');

  // Dictionary that holds the comments for each question
  const [origResponses, sortedResponses] = useMemo(() => {
    if (!info) return [{}, {}];
    const tempResponses: {
      [tag: string]: { questionText: string; responses: string[] };
    } = Object.fromEntries(
      evalQuestionTags.map((tag) => [tag, { questionText: '', responses: [] }]),
    );
    info.evaluation_narratives.forEach((data) => {
      const questionText = canonicalizeQuestionText(
        data.evaluation_question.question_text,
      );
      const questionTag = data.evaluation_question.tag ?? questionText;
      const questionInfo = tempResponses[questionTag] ?? {
        questionText,
        responses: [],
      };
      if (!questionInfo.questionText) {
        questionInfo.questionText = questionText;
      } else if (questionText !== questionInfo.questionText) {
        Sentry.captureException(
          new Error(
            `Question text mismatch: ${questionTag} ${questionText} vs. ${questionInfo.questionText}`,
          ),
        );
      }
      if (data.comment) questionInfo.responses.push(data.comment);
      tempResponses[questionTag] = questionInfo;
    });
    const sortedResponses = JSON.parse(
      JSON.stringify(tempResponses),
    ) as typeof tempResponses;
    for (const r of Object.values(tempResponses))
      r.responses.sort((a, b) => b.length - a.length);

    return [tempResponses, sortedResponses];
  }, [info]);

  // AI-generated summaries indexed by tag
  const summariesByTag = useMemo(() => {
    if (!info) return {};
    const map: { [tag: string]: string } = {};
    for (const s of info.evaluation_narrative_summaries) {
      const tag =
        s.evaluation_question.tag ??
        canonicalizeQuestionText(s.evaluation_question.question_text);
      if (s.summary) map[tag] = s.summary;
    }
    return map;
  }, [info]);

  // Number of questions
  const numQuestions = Object.keys(origResponses).length;

  const [filter, setFilter] = useState('');

  const curResponses = sortOrder === 'length' ? sortedResponses : origResponses;

  const context = document.querySelectorAll('.responses');
  const instance = new Mark(context);

  if (!info || !numQuestions) {
    return (
      <div>
        <strong>No evaluations available</strong>
      </div>
    );
  }
  const enrolled = info.evaluation_statistic?.enrolled ?? 0;

  return (
    <div>
      <Input
        id="filter-input"
        type="text"
        placeholder="Search evaluations..."
        value={filter}
        className={styles.filterInput}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFilter(event.target.value);
          instance.unmark({
            done() {
              instance.mark(event.target.value);
            },
          });
        }}
      />
      <div className={styles.sortBy}>
        <span className="fw-bold my-auto me-2">Sort comments by:</span>
        <div className={styles.sortOptions}>
          <button
            type="button"
            className={clsx(
              styles.sortOption,
              sortOrder === 'length' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('length')}
          >
            original order
          </button>
          <button
            type="button"
            className={clsx(
              styles.sortOption,
              sortOrder === 'original' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('original')}
          >
            length
          </button>
        </div>
      </div>
      <Tabs
        className={styles.tabs}
        variant="tabs"
        transition={false}
        onSelect={() => {
          // Scroll to top of modal when a different tab is selected
          document
            .querySelector('.modal-body')
            ?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        {Object.entries(curResponses).map(
          ([tag, { questionText, responses }]) =>
            responses.length !== 0 && (
              <Tab
                eventKey={tag}
                title={tag === questionText ? truncatedText(tag, 15, '') : tag}
                key={tag}
              >
                <div className={styles.questionHeader}>
                  <TextComponent>{questionText}</TextComponent>
                </div>
                <p className={styles.responseStats}>
                  <TextComponent type="secondary">
                    {responses.length}/{enrolled} (
                    {((responses.length / enrolled) * 100).toFixed(1)}%)
                    responses
                  </TextComponent>
                </p>
                {summariesByTag[tag] && (
                  <AiSummary text={summariesByTag[tag]} />
                )}
                <CommentRows responses={responses} filter={filter} />
              </Tab>
            ),
        )}
      </Tabs>
    </div>
  );
}

export default EvaluationResponses;
