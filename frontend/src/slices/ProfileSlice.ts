import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
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

export interface AllPrefs extends ProfessorPref, CoursePref {}

export interface ProfileActions {
  togglePref: (prefGroup: keyof ProfileState, pref: keyof AllPrefs) => void;
}

export interface ProfileSlice extends ProfileState, ProfileActions {}

export const defaultPreferences: ProfileState = {
  coursePref: {
    groupSameProf: true,
  },
  professorPref: {
    curveByCourse: false,
    groupRecurringCourses: true,
  },
};

export const createProfileSlice: StateCreator<
  Store,
  [],
  [['zustand/immer', never]],
  ProfileSlice
> = immer((set) => ({
  ...defaultPreferences,
  togglePref(prefGroup, pref) {
    set((state) => {
      (state[prefGroup] as AllPrefs)[pref] = !(state[prefGroup] as AllPrefs)[
        pref
      ];
    });
  },
}));
