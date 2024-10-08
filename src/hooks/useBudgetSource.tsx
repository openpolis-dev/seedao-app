import { useEffect, useState } from 'react';
import requests from 'requests';
import { ApplicationEntity } from 'type/application.type';
import { ProjectStatus } from 'type/project.type';

export default function useBudgetSource(filter_closed = false) {
  const [allSource, setAllSource] = useState<ISelectItem[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await requests.project.getProjects({
          page: 1,
          size: 1000,
          sort_order: 'desc',
          sort_field: 'create_ts',
          status: filter_closed ? ProjectStatus.Open : undefined,
        });
        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.Project,
        }));
      } catch (error) {
        logError('getProjects in city-hall failed: ', error);
        return [];
      }
    };
    const getGuilds = async () => {
      try {
        const res = await requests.guild.getProjects({
          page: 1,
          size: 1000,
          sort_order: 'desc',
          sort_field: 'create_ts',
        });
        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.Guild,
        }));
      } catch (error) {
        logError('getGuilds in city-hall failed: ', error);
        return [];
      }
    };
    const getBudgetSources = async () => {
      try {
        const res = await requests.budget.getBudgetSources({
          page: 1,
          size: 1000,
          sort_order: 'desc',
          sort_field: 'create_ts',
        });

        console.log(res.data.rows);
        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.CommonBudget,
        }));
      } catch (error) {
        logError('getBudgetSources in city-hall failed: ', error);
        return [];
      }
    };

    const getSources = async () => {
      const projects = await getProjects();
      const guilds = await getGuilds();
      const budgetSources = await getBudgetSources();
      setAllSource([...projects, ...guilds, ...budgetSources]);
    };
    getSources();
  }, []);

  return allSource;
}
