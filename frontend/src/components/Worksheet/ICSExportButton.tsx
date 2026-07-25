import saveFile from 'file-saver';
import { useShallow } from 'zustand/react/shallow';
import ICSIcon from '../../images/ics.svg';
import { track } from '../../lib/track';
import { useStore } from '../../store';
import { getCalendarEvents } from '../../utilities/calendar';

export default function ICSExportButton() {
  const { viewedSeason, courses, worksheets, viewedWorksheetNumber } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      courses: state.courses,
      worksheets: state.worksheets,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
    })),
  );

  const exportICS = () => {
    const events = getCalendarEvents('ics', courses, viewedSeason);
    if (events.length === 0) return;
    const worksheetName =
      worksheets?.get(viewedSeason)?.get(viewedWorksheetNumber)?.name ??
      (viewedWorksheetNumber === 0
        ? 'Main Worksheet'
        : `Worksheet ${viewedWorksheetNumber}`);
    track('calendar_export', { kind: 'ics', worksheet_name: worksheetName });
    const value = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
VERSION:2.0
BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:DAYLIGHT
DTSTART:20070311T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
TZNAME:EDT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
END:DAYLIGHT
BEGIN:STANDARD
DTSTART:20071104T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
TZNAME:EST
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
END:STANDARD
END:VTIMEZONE
${events.join('\n')}
END:VCALENDAR`;
    // Download to user's computer
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    saveFile(blob, `${viewedSeason}_worksheet.ics`);
  };

  return (
    <button type="button" onClick={exportICS}>
      <img style={{ height: '2rem' }} src={ICSIcon} alt="" />
      &nbsp;&nbsp;Download as ICS
    </button>
  );
}
