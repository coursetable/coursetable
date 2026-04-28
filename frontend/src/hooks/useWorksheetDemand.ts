import { useEffect, useState } from 'react';

import { fetchWorksheetDemand } from '../queries/api';

export function useWorksheetDemand(
  crn: number,
  season: string,
  enabled: boolean,
): { demand: number | null; loading: boolean } {
  const [demand, setDemand] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (enabled) {
      setLoading(true);
      setDemand(null);
      void fetchWorksheetDemand(crn, season).then((res) => {
        if (!active) return;
        setDemand(res?.demand ?? null);
        setLoading(false);
      });
    } else {
      setDemand(null);
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [crn, season, enabled]);

  return { demand, loading };
}
