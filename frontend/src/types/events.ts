import type { ProfilePrivacy } from '../queries/api';
import type { Filters } from '../search/searchTypes';

export type AppEvent =
  | {
      event_type: 'search';
      payload: {
        query: string;
        filters: Filters;
        n_results: number;
      };
    }
  | {
      event_type: 'course_view';
      payload: {
        course_code: string;
        term: string;
        came_from: 'search' | 'worksheet' | 'friend' | 'direct';
      };
    }
  | {
      event_type: 'eval_expand';
      payload: { course_code: string; term: string };
    }
  | {
      event_type: 'worksheet_add';
      payload: {
        course_code: string;
        term: string;
        worksheet_name: string;
      };
    }
  | {
      event_type: 'worksheet_remove';
      payload: {
        course_code: string;
        term: string;
        worksheet_name: string;
      };
    }
  | {
      event_type: 'worksheet_hide';
      payload: {
        course_code: string;
        term: string;
        worksheet_name: string;
        hidden: boolean;
      };
    }
  | {
      event_type: 'worksheet_color';
      payload: {
        course_code: string;
        term: string;
        worksheet_name: string;
        color: string;
      };
    }
  | {
      event_type: 'filter_change';
      payload: { filter: string; value: unknown };
    }
  | {
      event_type: 'calendar_export';
      payload: { kind: 'ics' | 'gcal'; worksheet_name: string };
    }
  | {
      event_type: 'friend_add';
      payload: { friend_id: string };
    }
  | {
      event_type: 'friend_worksheet_view';
      payload: { friend_id: string };
    }
  | {
      event_type: 'profile_update';
      payload: {
        profile_page_enabled: boolean;
        allow_anonymous_profile_view: boolean;
        preferred_name_set: boolean;
        privacy: ProfilePrivacy;
      };
    }
  | { event_type: 'session_start'; payload: { referrer?: string } };

export type EventType = AppEvent['event_type'];
