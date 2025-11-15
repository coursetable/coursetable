import { FaRegClipboard } from 'react-icons/fa';
import { compressToEncodedURIComponent } from 'lz-string';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import type { ExoticWorksheet } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';

export default function URLExportButton() {
  const { viewedSeason, viewedWorksheetName, courses, user } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetName: state.worksheetMemo.getViewedWorksheetName(state),
      courses: state.courses,
      user: state.user,
    })),
  );

  async function handleExport() {
    // Format creator name: "FirstName LastName" or fallback to netId
    const creatorName =
      user?.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : (user?.netId ?? 'Unknown');

    const payload: ExoticWorksheet = {
      season: viewedSeason,
      name: viewedWorksheetName,
      creatorName,
      courses: courses.map((c) => ({
        crn: c.listing.crn,
        hidden: c.hidden ?? false,
        color: c.color,
      })),
    };

    await navigator.clipboard.writeText(
      `${window.location.origin}/worksheet?ws=${compressToEncodedURIComponent(JSON.stringify(payload))}`,
    );
    toast.success(
      'Worksheet copied to clipboard as URL! You can share this worksheet with others. Paste the link into the address bar to view the worksheet.',
    );
  }

  return (
    <button type="button" onClick={handleExport}>
      <span style={{ height: '2rem', width: '2rem', display: 'inline-block' }}>
        <FaRegClipboard style={{ height: '1.5rem', width: '1.5rem' }} />
      </span>
      &nbsp;&nbsp;Copy worksheet as URL
    </button>
  );
}
