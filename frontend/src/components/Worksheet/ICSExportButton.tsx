import React from 'react';
import FileSaver from 'file-saver';
import { useWorksheet } from '../../contexts/worksheetContext';
import { getCalendarEvents } from '../../utilities/calendar';
import ICSIcon from '../../images/ics.svg';

export default function ICSExportButton() {
  const { curSeason, hiddenCourses, courses } = useWorksheet();

  const exportICS = () => {
    const events = getCalendarEvents('ics', courses, curSeason, hiddenCourses);
    // Error already reported
    if (events.length === 0) return;
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
    FileSaver.saveAs(blob, `${curSeason}_worksheet.ics`);
  };

  return (
    // TODO
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onClick={exportICS}>
      <img style={{ height: '2rem' }} src={ICSIcon} alt="" />
      &nbsp;&nbsp;Download as ICS
    </div>
  );
}
