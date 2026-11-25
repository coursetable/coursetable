import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Form, ListGroup } from 'react-bootstrap';
import { MdOpenInNew } from 'react-icons/md';

import { fetchCourseNotes, type CourseNote } from '../../queries/api';
import { useCourseDataFromSameCourseIdsQuery } from '../../queries/graphql-queries';
import type { Crn, Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { toSeasonString } from '../../utilities/course';
import { createCourseModalLink } from '../../utilities/display';
import { noteText } from '../CourseModal/NotesPanel/noteContent';
import NoteEditor from '../CourseModal/NotesPanel/NoteEditor';
import { whenNotesSaved } from '../CourseModal/NotesPanel/noteSaver';
import Spinner from '../Spinner';
import { TextComponent } from '../Typography';
import styles from './MyNotes.module.css';

type CourseInfo = {
  codes: string[];
  title: string;
  season: Season;
  crn: Crn;
};

type Loaded = { notes: CourseNote[]; version: number };

const relativeTime = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

function editedAgo(time: number) {
  const minutes = Math.round((time - Date.now()) / 60_000);
  if (minutes > -60) return relativeTime.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours > -24) return relativeTime.format(hours, 'hour');
  const days = Math.round(hours / 24);
  if (days > -30) return relativeTime.format(days, 'day');
  return new Date(time).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function useCourseInfo(sameCourseIds: number[]) {
  const { data, loading } = useCourseDataFromSameCourseIdsQuery({
    variables: { sameCourseIds, hasEvals: false },
    skip: sameCourseIds.length === 0,
  });
  const listings = data?.listings ?? [];
  const latest = new Map<number, (typeof listings)[number][]>();
  for (const listing of listings) {
    const id = listing.course.same_course_id;
    const current = latest.get(id);
    if (!current || listing.season_code > current[0]!.season_code)
      latest.set(id, [listing]);
    else if (listing.season_code === current[0]!.season_code)
      current.push(listing);
  }
  const info = new Map<number, CourseInfo>();
  for (const [id, group] of latest) {
    const first = group.reduce((a, b) => (b.crn < a.crn ? b : a));
    info.set(id, {
      codes: [...new Set(group.map((l) => l.course_code))],
      title: first.course.title,
      season: first.season_code,
      crn: first.crn,
    });
  }
  return { info, loading };
}

function MyNotes() {
  const [searchParams] = useSearchParams();
  const modalOpen = useStore((state) => state.currentModal !== undefined);
  const [loaded, setLoaded] = useState<Loaded | 'loading' | 'failed'>(
    'loading',
  );
  const [edits, setEdits] = useState<{
    [key: number]: { content: string; updatedAt: number };
  }>({});
  const [selected, setSelected] = useState<{
    id: number;
    content: string;
  } | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'subject'>('recent');
  const [reloading, setReloading] = useState(true);

  useEffect(() => {
    if (modalOpen) return undefined;
    let cancelled = false;
    setReloading(true);
    void whenNotesSaved()
      .then(fetchCourseNotes)
      .then((fetched) => {
        if (cancelled) return;
        setReloading(false);
        if (!fetched) {
          setLoaded((prev) => (prev === 'loading' ? 'failed' : prev));
          return;
        }
        setLoaded((prev) => ({
          notes: fetched,
          version: typeof prev === 'object' ? prev.version + 1 : 0,
        }));
        setEdits({});
        setSelected((prev) => {
          const keep = prev && fetched.find((n) => n.sameCourseId === prev.id);
          const pick =
            keep ?? [...fetched].sort((a, b) => b.updatedAt - a.updatedAt)[0];
          return pick ? { id: pick.sameCourseId, content: pick.content } : null;
        });
      });
    return () => {
      cancelled = true;
    };
  }, [modalOpen]);

  const notes = typeof loaded === 'object' ? loaded.notes : [];
  const { info, loading: courseLoading } = useCourseInfo(
    notes.map((n) => n.sameCourseId),
  );

  if (loaded === 'loading' || courseLoading)
    return <Spinner message="Loading your notes..." />;
  if (loaded === 'failed') {
    return (
      <TextComponent type="secondary">
        Couldn&apos;t load your notes. Try again later.
      </TextComponent>
    );
  }
  if (notes.length === 0) {
    return (
      <TextComponent type="secondary">
        No notes yet. Open any course and use its My Notes tab to add one.
      </TextComponent>
    );
  }

  const items = notes.map((note) => {
    const edit = edits[note.sameCourseId];
    const content = edit?.content ?? note.content;
    return {
      id: note.sameCourseId,
      content,
      updatedAt: edit?.updatedAt ?? note.updatedAt,
      text: noteText(content),
      course: info.get(note.sameCourseId),
    };
  });
  const q = query.trim().toLowerCase();
  const shown = items
    .filter(
      (item) =>
        !q ||
        item.text.toLowerCase().includes(q) ||
        item.course?.title.toLowerCase().includes(q) ||
        item.course?.codes.some((code) => code.toLowerCase().includes(q)),
    )
    .sort((a, b) =>
      sort === 'subject'
        ? (a.course?.codes[0] ?? '~').localeCompare(
            b.course?.codes[0] ?? '~',
            undefined,
            { numeric: true },
          )
        : b.updatedAt - a.updatedAt,
    );
  const active = items.find((item) => item.id === selected?.id);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <Form.Control
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes or courses"
          aria-label="Search notes or courses"
          className={styles.search}
        />
        <Form.Select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'recent' | 'subject')}
          aria-label="Sort notes"
          className="w-auto"
        >
          <option value="recent">Recently edited</option>
          <option value="subject">Subject</option>
        </Form.Select>
        <TextComponent type="tertiary" small>
          {shown.length} of {items.length} notes
        </TextComponent>
      </div>
      <div className={styles.split}>
        <ListGroup variant="flush" className={styles.list}>
          {shown.length === 0 && (
            <TextComponent type="tertiary" as="p" className="p-3 mb-0">
              No notes match “{query.trim()}”.
            </TextComponent>
          )}
          {shown.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              as="button"
              className={clsx(
                styles.item,
                item.id === active?.id && styles.itemActive,
              )}
              aria-current={item.id === active?.id}
              onClick={() =>
                setSelected({ id: item.id, content: item.content })
              }
            >
              <div className="d-flex align-items-baseline gap-2 min-w-0">
                <strong className="flex-shrink-0">
                  {item.course?.codes[0] ?? 'Unknown course'}
                </strong>
                {item.course && (
                  <TextComponent
                    type="tertiary"
                    small
                    className="text-truncate"
                    title={item.course.title}
                  >
                    {item.course.title}
                  </TextComponent>
                )}
              </div>
              <TextComponent
                type="secondary"
                small
                as="div"
                className="text-truncate"
              >
                {item.text || 'Empty note'}
              </TextComponent>
              <TextComponent type="tertiary" small as="div">
                {editedAgo(item.updatedAt)}
              </TextComponent>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className={clsx(styles.detail, 'px-4 py-3')}>
          {active && selected && (
            <>
              <div
                className={clsx(
                  styles.detailHead,
                  'd-flex flex-wrap justify-content-between align-items-start gap-2 mb-3 pb-2',
                )}
              >
                <div>
                  <TextComponent type="tertiary" small as="div">
                    {active.course?.codes.join(' / ')}
                  </TextComponent>
                  <h4 className="h5 mb-0">
                    {active.course?.title ?? 'Unknown course'}
                  </h4>
                  <TextComponent type="tertiary" small as="div">
                    {active.course &&
                      `Latest offering: ${toSeasonString(active.course.season)} · `}
                    Edited {editedAgo(active.updatedAt)}
                  </TextComponent>
                </div>
                {active.course && (
                  <Link
                    to={createCourseModalLink(
                      {
                        crn: active.course.crn,
                        course: { season_code: active.course.season },
                      },
                      searchParams,
                    )}
                    state={{ courseModalView: 'notes' }}
                    className="d-inline-flex align-items-center gap-1 text-nowrap"
                  >
                    Open course <MdOpenInNew aria-hidden />
                  </Link>
                )}
              </div>
              {!modalOpen && !reloading && typeof loaded === 'object' && (
                <NoteEditor
                  key={`${selected.id}-${loaded.version}`}
                  sameCourseId={selected.id}
                  initialContent={selected.content}
                  onChange={(content) =>
                    setEdits((prev) => ({
                      ...prev,
                      [selected.id]: { content, updatedAt: Date.now() },
                    }))
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyNotes;
