import { createContext, useContext } from 'react';

type WorksheetCalendarListContextValue = {
  readonly showLocation: boolean;
  readonly showMissingLocationIcon: boolean;
  readonly highlightBuilding: string | null;
  readonly missingBuildingCodes: Set<string>;
  readonly hideTooltipContext: 'calendar' | 'map';
};

const WorksheetCalendarListContext =
  createContext<WorksheetCalendarListContextValue | null>(null);

export function useWorksheetCalendarListContext() {
  const context = useContext(WorksheetCalendarListContext);
  if (!context) {
    throw new Error(
      'WorksheetCalendarListContext must be used within a provider',
    );
  }
  return context;
}

export default WorksheetCalendarListContext;
