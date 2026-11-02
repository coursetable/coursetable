import { useMemo } from 'react';
import buildingCoordinates from '../data/buildingCoordinates';
import type { WorksheetCourse } from '../slices/WorksheetSlice';

export type MarkerGroup = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  rooms: string[];
  courses: WorksheetCourse[];
};

export type MissingGroup = {
  code: string;
  name: string;
  count: number;
};

export function useLocationGroups(courses: WorksheetCourse[]) {
  return useMemo(() => {
    const grouped = new Map<string, MarkerGroup>();
    const missing = new Map<string, MissingGroup>();

    for (const course of courses) {
      if (course.hidden) continue;
      for (const meeting of course.listing.course.course_meetings) {
        const { location } = meeting;
        if (!location) continue;
        const buildingCode = location.building.code;
        const buildingInfo = buildingCoordinates[buildingCode];
        if (!buildingInfo) {
          const friendlyName = buildingCode;
          const existing = missing.get(buildingCode) ?? {
            code: buildingCode,
            name: friendlyName,
            count: 0,
          };
          existing.count += 1;
          missing.set(buildingCode, existing);
          continue;
        }

        const group =
          grouped.get(buildingCode) ??
          ({
            code: buildingCode,
            name: buildingInfo.name ?? buildingCode,
            lat: buildingInfo.lat,
            lng: buildingInfo.lng,
            rooms: [],
            courses: [],
          } as MarkerGroup);
        if (meeting.location?.room) {
          if (!group.rooms.includes(meeting.location.room))
            group.rooms.push(meeting.location.room);
        }
        group.courses.push(course);
        grouped.set(buildingCode, group);
      }
    }

    const markers = [...grouped.values()].sort(
      (a, b) => b.courses.length - a.courses.length,
    );
    const missingList = [...missing.values()].sort((a, b) => b.count - a.count);
    return { markers, missing: missingList };
  }, [courses]);
}
