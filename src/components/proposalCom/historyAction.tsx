import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CreateImg from '../../assets/Imgs/proposal/create.png';
import VoteImg from '../../assets/Imgs/proposal/vote.png';
import ShareImg from '../../assets/Imgs/proposal/share.png';
import CommentImg from '../../assets/Imgs/proposal/comment.png';

type ActionDataType = {
  content: string;
  time: string;
  type: string;
};

export default function HistoryAction() {
  const { t } = useTranslation();
  const [list, setList] = useState<ActionDataType[]>([]);

  useEffect(() => {
    // TODO: get history action list
    setList([
      { content: t('Proposal.ActivityCreate', { title: 'lalalala' }), time: '2021-09-09', type: 'create' },
      {
        content: t('Proposal.ActivityComment', { title: 'lalalala', author: 'apple' }),
        time: '2021-09-09',
        type: 'vote',
      },
      {
        content: t('Proposal.ActivityComment', { title: 'lalalala', author: 'apple' }),
        time: '2021-09-09',
        type: 'share',
      },
      {
        content: t('Proposal.ActivityComment', { title: 'lalalala', author: 'apple' }),
        time: '2021-09-09',
        type: 'comment',
      },
    ]);
  }, []);

  const returnImg = (type: string) => {
    switch (type) {
      case 'create':
        return CreateImg;
      case 'vote':
        return VoteImg;
      case 'share':
        return ShareImg;
      case 'comment':
        return CommentImg;
    }
  };
  return (
    <ActionList>
      {list.map((item, index) => (
        <Aciton key={index}>
          <div className="icon">
            <img src={returnImg(item.type)} alt="" />
          </div>
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
