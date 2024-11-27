import { useEffect, useState } from 'react';
import { getSeasons } from 'requests/applications';

export default function useCurSeason() {
  const [curSeason, setCurSeason] = useState<{ label: string; value: number, start: number, end: number }>();
  useEffect(() => {
    const getCurrentSeason = async () => {
      try {
        const resp = await getSeasons();
        
        let seasons = resp.data?.map((item) => ({
          label: item.name,
          value: item.id,
          start: parseInt(item.start_at),
          end: parseInt(item.end_at),
        }));

        let cur = seasons.find(season => {
          let now = Math.floor(Date.now()/1000);
          return season.start < now && now < season.end;
        });

        setCurSeason(cur);

      } catch (error) {
        logError('getSeasons failed', error);
      }
    };
    getCurrentSeason();
  }, []);
  return curSeason;
}
