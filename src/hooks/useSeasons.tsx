import { useEffect, useState } from 'react';
import { getSeasons } from 'requests/applications';

export default function useSeasons() {
  const [seasons, setSeasons] = useState<{ label: string; value: number, start: number, end: number }[]>([]);
  useEffect(() => {
    const getSeasonList = async () => {
      try {
        const resp = await getSeasons();
        let seasons:any[] =  resp.data?.map((item) => ({
          label: item.name,
          value: item.id,
          start: parseInt(item.start_at),
          end: parseInt(item.end_at),
        }))
        setSeasons(
          seasons?.reverse()
        );
      } catch (error) {
        logError('getSeasons failed', error);
      }
    };
    getSeasonList();
  }, []);
  return seasons;
}
