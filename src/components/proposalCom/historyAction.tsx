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
            <div className="title">{item.content}</div>
            <div className="time">{item.time}</div>
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
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid var(--bs-border-color);
  margin: 0 24px;
  &:hover {
    background-color: var(--bs-menu-hover);
  }
  .icon {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #ddd;
    margin-right: 16px;
  }
  .title {
    font-size: 16px;
    color: var(--bs-body-color_active);
    margin-bottom: 4px;
  }
  .time {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
  .action-content {
    flex: 1;
    padding-top: 20px;
    padding-bottom: 10px;
  }
`;
