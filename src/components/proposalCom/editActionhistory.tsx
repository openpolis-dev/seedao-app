import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditHistoryType } from 'type/proposal.type';
import { formatDate } from 'utils/time';

type ActionDataType = {
  content: string;
  link: string;
};

interface IProps {
  data: EditHistoryType[];
}

export default function EditActionHistory({ data }: IProps) {
  const { t } = useTranslation();
  const [list, setList] = useState<ActionDataType[]>([]);

  useEffect(() => {
    setList(
      data.map((item, idx) => {
        return {
          content: t(idx === data.length - 1 ? 'Proposal.HistoryCreate' : 'Proposal.HistoryEdit', {
            title: 'lalalala',
            time: formatDate(new Date(item.created_at)),
          }),
          link: `https://arweave.net/tx/${item.arweave}/data.html`,
        };
      }),
    );
  }, [data]);
  return (
    <ActionList>
      {list.map((item, index) => (
        <Aciton key={index}>
          <div className="action-content" onClick={() => window.open(item.link, '_blank')}>
            <div>aaa.seedao</div>
            <div>{item.content}</div>
          </div>
        </Aciton>
      ))}
    </ActionList>
  );
}

const ActionList = styled.ul`
  background-color: var(--bs-box--background);
  padding-block: 30px;
  border-radius: 16px;
`;

const Aciton = styled.li`
  padding-inline: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: var(--bs-menu-hover);
  }
  .action-content {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--bs-border-color);
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
