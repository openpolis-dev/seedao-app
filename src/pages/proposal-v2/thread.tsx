import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';
import { IBaseProposal, EditHistoryType } from 'type/proposal.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import requests from 'requests';
import { formatDate } from 'utils/time';
import BackerNav from 'components/common/backNav';
import MoreSelectAction from 'components/proposalCom/moreSelectAction';

enum BlockContentType {
  Reply = 1,
  History,
}

interface IProps {}

export default function ThreadPage() {
  const { state } = useLocation();
  const [search] = useSearchParams();
  // review: true -> review proposal
  const review = search.get('review') === '';
  const { id } = useParams();
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const [blockType, setBlockType] = useState<BlockContentType>(BlockContentType.Reply);
  const [data, setData] = useState<IBaseProposal>();
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [totalEditCount, setTotalEditCount] = useState<number>(0);
  const [editHistoryList, setEditHistoryList] = useState<EditHistoryType[]>([]);

  useEffect(() => {
    if (state) {
      setData(state);
    }
    const getProposalDetail = async () => {
      // TODO
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      try {
        const res = await requests.proposal.getProposalDetail(Number(id));
        setData(res.data.thread);
        setPosts(res.data.thread.posts);
        setTotalPostsCount(res.data.thread.posts_count);
        setTotalEditCount(res.data.thread.edit_history?.count ?? 0);
        setEditHistoryList(res.data.thread.edit_history?.lists ?? []);
      } catch (error) {
        console.error('get proposal detail error:', error);
      } finally {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      }
    };
    getProposalDetail();
  }, [id, state]);

  const onUpdateStatus = (status: string) => {
    // TODO
  };

  const openComment = () => {
    // TODO
  };

  const handleEdit = () => {
    // TODO
    console.log('edit');
  };
  const handlWithdraw = () => {
    // TODO
    console.log('withdrawn');
  };

  const handleClickMoreAction = (action: string) => {
    switch (action) {
      case 'edit':
        handleEdit();
        break;
      case 'withdrawn':
        handlWithdraw();
        break;
    }
  };

  const currentStoreHash = editHistoryList[editHistoryList.length - 1]?.arweave;

  return (
    <Page>
      <BackerNav title="" to="/proposal-v2" mb="20px" />
      <ThreadHead>
        <div className="title">{data?.title}</div>
        <ThreadCenter>
          <UserBox>
            <img src={data?.user.photo_url} alt="" />
            <span>{data?.user.username}</span>
            <div className="date">{formatDate(new Date(data?.updated_at || ''))}</div>
          </UserBox>
          <ThreadInfo></ThreadInfo>
        </ThreadCenter>
        <StoreHash href={`https://arweave.net/tx/${currentStoreHash}/data.html`} target="_blank">
          Arweave Hash {currentStoreHash}
        </StoreHash>
      </ThreadHead>
      <ThreadToolsBar>
        <li>{t('Proposal.Vote')}</li>
        <li onClick={openComment}>{t('Proposal.Comment')}</li>
        <li>{t('Proposal.Share')}</li>
        <li>
          <MoreSelectAction
            options={[
              { label: t('Proposal.Edit'), value: 'edit' },
              { label: t('Proposal.Withdrawn'), value: 'withdrawn' },
            ]}
            handleClickAction={handleClickMoreAction}
          />
        </li>
      </ThreadToolsBar>
      {data?.polls?.[0] && <ProposalVote poll={data.polls[0]} />}
      <ReplyAndHistoryBlock>
        <BlockTab>
          <li
            className={blockType === BlockContentType.Reply ? 'selected' : ''}
            onClick={() => setBlockType(BlockContentType.Reply)}
          >
            {`${totalPostsCount} `}
            {t('Proposal.Comment')}
          </li>
          <li
            className={blockType === BlockContentType.History ? 'selected' : ''}
            onClick={() => setBlockType(BlockContentType.History)}
          >
            {`${totalEditCount} `}
            {t('Proposal.EditHistory')}
          </li>
        </BlockTab>
        {blockType === BlockContentType.Reply && <ReplyComponent hideReply={review} posts={posts} />}
        {blockType === BlockContentType.History && <EditActionHistory data={editHistoryList} />}
      </ReplyAndHistoryBlock>
      {review && <ReviewProposalComponent onUpdateStatus={onUpdateStatus} />}
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
`;

const ReplyAndHistoryBlock = styled.div`
  margin-top: 20px;
`;

const BlockTab = styled.ul`
  display: flex;
  font-size: 20px;
  gap: 40px;
  margin-bottom: 16px;
  li {
    cursor: pointer;
  }
  li.selected {
    color: var(--bs-primary);
  }
`;

const ThreadCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ThreadHead = styled.div`
  background-color: var(--bs-box-background);
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 16px;
  .title {
    font-size: 20px;
  }
`;

const UserBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-block: 16px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .date {
    margin-left: 20px;
  }
`;

const ThreadInfo = styled.div``;

const StoreHash = styled.a``;

const ThreadToolsBar = styled.ul`
  background-color: var(--bs-box-background);
  border-radius: 16px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  li {
    cursor: pointer;
  }
`;
