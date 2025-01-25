import { useEffect, useState } from 'react';
import requests from 'requests';
import { ApplicationEntity } from 'type/application.type';
import { ProjectStatus } from 'type/project.type';
import useToast, { ToastType } from "./useToast";

export default function useBudgetSource(filter_closed = false) {
  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const {  showToast } = useToast();

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
      } catch (error:any) {
        logError('getProjects in city-hall failed: ', error);
        showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
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
      } catch (error:any) {
        logError('getGuilds in city-hall failed: ', error);
        showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
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

        return res.data.rows.map((item) => ({
          label: item.name,
          value: item.id,
          data: ApplicationEntity.CommonBudget,
        }));
      } catch (error:any) {
        logError('getBudgetSources in city-hall failed: ', error);
        showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
        return [];
      }
    };

    const getSources = async () => {
      try{
        const projects = await getProjects();
        const guilds = await getGuilds();
        const budgetSources = await getBudgetSources();
        setAllSource([...projects, ...guilds, ...budgetSources]);
      }catch (error:any){
        showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      }

    };
    getSources();
  }, []);

  return allSource;
}
