import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IProposalEditHistoy } from 'type/proposalV2.type';
import { formatDate } from 'utils/time';
import { useAuthContext } from 'providers/authProvider';
import useQuerySNS from 'hooks/useQuerySNS';
import publicJs from 'utils/publicJs';

type ActionDataType = {
  content: string;
  link: string;
  wallet: string;
};

interface IProps {
  data: IProposalEditHistoy[];
}

export default function EditActionHistory({ data }: IProps) {
  const { t } = useTranslation();
  const {
    state: { snsMap },
  } = useAuthContext();
  const [list, setList] = useState<ActionDataType[]>([]);

  const { getMultiSNS } = useQuerySNS();

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };
  useEffect(() => {
    setList(
      data.map((item, idx) => {
        return {
          content: t(idx === data.length - 1 ? 'Proposal.HistoryCreate' : 'Proposal.HistoryEdit', {
            title: item.title,
            time: formatDate(new Date(item.create_ts * 1000)),
          }),
          wallet: item.wallet,
          link: `https://arweave.net/tx/${item.arweave}/data.html`,
        };
      }),
    );
    getMultiSNS(Array.from(new Set(data.map((item) => item.wallet))));
  }, [data]);
  return (
    <ActionList>
      {list.map((item, index) => (
        <Aciton key={index}>
          <div className="action-content" onClick={() => window.open(item.link, '_blank')}>
            <div className="sns">{formatSNS(item.wallet?.toLocaleLowerCase())}</div>
            <div>{item.content}</div>
          </div>
        </Aciton>
      ))}
    </ActionList>
  );
}

const ActionList = styled.ul``;

const Aciton = styled.li`
  padding-inline: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  color: var(--bs-body-color_active);
  &:hover {
    background-color: var(--bs-menu-hover);
  }
  .action-content {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 10px;
    //border-bottom: 1px solid var(--bs-border-color);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .sns {
    color: #2f8fff;
  }
`;
