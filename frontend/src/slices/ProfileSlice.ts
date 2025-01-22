import type { StateCreator } from 'zustand';
import type { Store } from '../store';

interface ProfessorPref {
  curveByCourse: boolean;
  groupRecurringCourses: boolean;
}

interface CoursePref {
  groupSameProf: boolean;
}

export interface ProfileState {
  coursePref: CoursePref;
  professorPref: ProfessorPref;
}

type ProfileActions = object; // Replace with backend API calls when ready

export interface ProfileSlice extends ProfileState, ProfileActions {}

export const createProfileSlice: StateCreator<
  Store,
  [],
  [],
  ProfileSlice
> = () => ({
  coursePref: {
    groupSameProf: false,
  },
  professorPref: {
    curveByCourse: false,
    groupRecurringCourses: false,
  },
});
