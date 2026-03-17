import { FaRegClipboard } from 'react-icons/fa';
import { compressToEncodedURIComponent } from 'lz-string';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import type { ExoticWorksheet } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';

export default function URLExportButton() {
  const {
    viewedSeason,
    viewedWorksheetName,
    courses,
    user,
    exoticWorksheet,
    viewedPerson,
    friends,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetName: state.worksheetMemo.getViewedWorksheetName(state),
      courses: state.courses,
      user: state.user,
      exoticWorksheet: state.exoticWorksheet,
      viewedPerson: state.viewedPerson,
      friends: state.friends,
    })),
  );

  async function handleExport() {
    if (!user) {
      toast.error('You are not logged in!');
      return;
    }
    // Use the worksheet owner's name, not the exporter's
    const userDisplayName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.netId;
    const creatorName =
      exoticWorksheet?.data.creatorName ??
      (viewedPerson !== 'me'
        ? (friends?.[viewedPerson]?.name ?? viewedPerson)
        : userDisplayName);

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
      &nbsp;&nbsp;Export worksheet as URL
    </button>
  );
}
