import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useFerry } from '../contexts/ferryContext';
import type { CourseModalPrefetchListingDataFragment } from '../generated/graphql-types';
import { useCourseModalFromUrlQuery } from '../queries/graphql-queries';
import { useStore } from '../store';
import { parseCourseModalQuery } from '../utilities/modalHistoryUrl';

function useCourseInfoFromURL(
  isInitial: boolean,
): CourseModalPrefetchListingDataFragment | undefined {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const courseModal = searchParams.get('course-modal');
  const variables = parseCourseModalQuery(courseModal);
  const { courses } = useFerry();
  const inStaticCatalog =
    variables !== undefined && Object.hasOwn(courses, variables.seasonCode);
  const { data } = useCourseModalFromUrlQuery({
    variables: {
      listingId: variables?.listingId ?? 0,
      hasEvals: Boolean(user?.hasEvals),
    },
    skip: !variables || !isInitial || inStaticCatalog,
  });
  if (variables === undefined) return undefined;
  if (inStaticCatalog)
    return courses[variables.seasonCode]!.data.get(variables.crn);
  return data?.listings_by_pk ?? undefined;
}

function useProfInfoFromURL(): number | undefined {
  const [searchParams] = useSearchParams();
  const profModal = searchParams.get('prof-modal');
  if (!profModal) return undefined;
  const id = Number(profModal);
  return Number.isFinite(id) ? id : undefined;
}

/**
 * Hydrates modal history from URL query params and clears suppression when the
 * URL no longer carries modal keys (after closeModal / navigation).
 */
export default function ModalHistoryBridge() {
  const [searchParams] = useSearchParams();
  const historyLen = useStore((s) => s.history.length);
  const suppressInitialFromUrl = useStore((s) => s.suppressInitialFromUrl);
  const navigate = useStore((s) => s.navigate);
  const clearUrlSuppression = useStore((s) => s.clearUrlSuppression);

  const isInitial = historyLen === 0;
  const courseFromURL = useCourseInfoFromURL(isInitial);
  const profFromURL = useProfInfoFromURL();

  const searchKey = searchParams.toString();

  const prevCourseModalRef = useRef<string | null | undefined>(undefined);
  const prevProfModalRef = useRef<string | null | undefined>(undefined);

  // After popping the last frame, suppress blocks re-open from the same URL.
  // Clear suppression when course-modal / prof-modal *values* change so
  // another deep link hydrates. Do not clear on unrelated searchKey edits.
  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    const c = params.get('course-modal');
    const p = params.get('prof-modal');
    const hadPrev = prevCourseModalRef.current !== undefined;
    const modalParamsChanged =
      hadPrev &&
      (c !== prevCourseModalRef.current || p !== prevProfModalRef.current);
    prevCourseModalRef.current = c;
    prevProfModalRef.current = p;
    if (
      suppressInitialFromUrl &&
      historyLen === 0 &&
      (c !== null || p !== null) &&
      modalParamsChanged
    )
      clearUrlSuppression();
  }, [clearUrlSuppression, historyLen, searchKey, suppressInitialFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    if (
      !params.has('course-modal') &&
      !params.has('prof-modal') &&
      suppressInitialFromUrl
    )
      clearUrlSuppression();
  }, [clearUrlSuppression, searchKey, suppressInitialFromUrl]);

  useEffect(() => {
    if (suppressInitialFromUrl) return;
    if (historyLen > 0) return;
    const params = new URLSearchParams(searchKey);
    if (courseFromURL) {
      navigate('replace', { type: 'course', data: courseFromURL }, params);
      return;
    }
    if (profFromURL !== undefined)
      navigate('replace', { type: 'professor', data: profFromURL }, params);
  }, [
    courseFromURL,
    historyLen,
    navigate,
    profFromURL,
    searchKey,
    suppressInitialFromUrl,
  ]);

  return null;
}
