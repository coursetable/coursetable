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

export interface ProfileActions {
  togglePreference: (pref: keyof ProfileState) => void;
}

export interface ProfileSlice extends ProfileState, ProfileActions {}

export const defaultPreferences: ProfileState = {
  coursePref: {
    groupSameProf: false,
  },
  professorPref: {
    curveByCourse: false,
    groupRecurringCourses: false,
  },
};

export const createProfileSlice: StateCreator<Store, [], [], ProfileSlice> = (
  set,
) => ({
  ...defaultPreferences,
  togglePreference(pref) {
    set((state) => {
      const newValue = !state[pref];
      return { [pref]: newValue };
    });
  },
});
