import { useEffect, useState } from 'react';
import requests from 'requests';
import { ApplicationEntity } from 'type/application.type';

export default function useBudgetSource() {
  const [allSource, setAllSource] = useState<ISelectItem[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await requests.project.getProjects({
          page: 1,
          size: 1000,
          sort_order: 'desc',
          sort_field: 'created_at',
        });
        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.Project,
        }));
      } catch (error) {
        console.error('getProjects in city-hall failed: ', error);
        return [];
      }
    };
    const getGuilds = async () => {
      try {
        const res = await requests.guild.getProjects({
          page: 1,
          size: 1000,
          sort_order: 'desc',
          sort_field: 'created_at',
        });
        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.Guild,
        }));
      } catch (error) {
        console.error('getGuilds in city-hall failed: ', error);
        return [];
      }
    };
    const getSources = async () => {
      const projects = await getProjects();
      const guilds = await getGuilds();
      setAllSource([...projects, ...guilds]);
    };
    getSources();
  }, []);

  return allSource;
}
