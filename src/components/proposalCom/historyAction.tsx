import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type ActionDataType = {
  content: string;
  time: string;
};

export default function HistoryAction() {
  const { t } = useTranslation();
  const [list, setList] = useState<ActionDataType[]>([]);

  useEffect(() => {
    // TODO: get history action list
    setList([
      { content: t('Proposal.ActivityCreate', { title: 'lalalala' }), time: '2021-09-09' },
      { content: t('Proposal.ActivityComment', { title: 'lalalala', author: 'apple' }), time: '2021-09-09' },
    ]);
  }, []);
  return (
    <ActionList>
      {list.map((item, index) => (
        <Aciton key={index}>
          <div className="icon"></div>
          <div className="action-content">
            <div>{item.content}</div>
            <div>{item.time}</div>
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
  .icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ddd;
  }
  .action-content {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--bs-border-color);
  }
`;
