import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { useEffect, useState } from 'react';
import PropsalModal from 'components/guild/propsalModal';
import { ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import NoItem from 'components/noItem';
import ProposalCard from 'components/proposal/proposalCard';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';

const Box = styled.div`
  padding: 20px 0;
`;

const UlBox = styled.div``;
const TitleBox = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
`;
const TopBox = styled.div`
  background: #f8f8f8;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;

const DescBox = styled.div`
  font-size: 12px;
`;

interface Iprops {
  detail?: ReTurnProject;
  refreshProject: () => any;
}
export default function ProjectProposal(props: Iprops) {
  const { detail, refreshProject } = props;
  const router = useRouter();
  const { id } = router.query;
  const [show, setShow] = useState(false);
  const [list, setList] = useState<IBaseProposal[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const getProposals = async (ids: string[]) => {
    const reqs = ids.map((pid) => requests.proposal.getProposalDetail(Number(pid)));
    setLoading(true);
    try {
      const resList = await Promise.allSettled(reqs);
      const _list: IBaseProposal[] = [];
      resList.forEach((res) => {
        if (res.status === 'fulfilled') {
          const thread = res.value.data.thread;
          thread && _list.push(thread);
        }
      });
      setList(_list);
    } catch (error) {
      console.error('get proposals error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (detail?.proposals) {
      getProposals(detail?.proposals);
    }
  }, [id, detail]);

  const handleModal = () => {
    setShow(true);
  };
  const closeModal = (ifRefresh: boolean) => {
    setShow(false);
    ifRefresh && refreshProject();
  };

  return (
    <Box>
      {show && <PropsalModal closeModal={closeModal} />}

      <TopBox>
        <Button onClick={() => window.open('https://forum.seedao.xyz/', '_blank')}>{t('Guild.createProposal')}</Button>
        <Button appearance="outline" onClick={() => handleModal()}>
          {t('Guild.AssociatedProposal')}
        </Button>
      </TopBox>
      <UlBox>
        {list.map((item) => (
          <ProposalCard key={item.id} data={item} />
        ))}
      </UlBox>
      {!list.length && <NoItem />}
    </Box>
  );
}
