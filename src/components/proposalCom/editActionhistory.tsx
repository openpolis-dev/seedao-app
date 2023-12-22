import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ActionDataType = {
  content: string;
};

export default function EditActionHistory() {
  const { t } = useTranslation();
  const [list, setList] = useState<ActionDataType[]>([]);

  useEffect(() => {
    // TODO: get history action list
    setList([
      { content: t('Proposal.HistoryCreate', { title: 'lalalala', time: '2021-09-09' }) },
      { content: t('Proposal.HistoryEdit', { title: 'lalalala', time: '2021-09-09' }) },
    ]);
  }, []);
  return (
    <ActionList>
      {list.map((item, index) => (
        <Aciton key={index}>
          <div className="action-content">
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
