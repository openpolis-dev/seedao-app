import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent, { IReplyOutputProps } from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';
import { IBaseProposal, EditHistoryType } from 'type/proposal.type';
import { IContentBlock, IProposal, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import requests from 'requests';
import { formatDate } from 'utils/time';
import BackerNav from 'components/common/backNav';
import MoreSelectAction from 'components/proposalCom/moreSelectAction';
import { MdPreview } from 'md-editor-rt';
import ProposalStateTag, { getRealState } from 'components/proposalCom/stateTag';
import useProposalCategories from 'hooks/useProposalCategories';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';

enum BlockContentType {
  Reply = 1,
  History,
}

interface IProps {}

export default function ThreadPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [search] = useSearchParams();
  // review: true -> review proposal
  const review = search.get('review') === '';
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  const checkMetaforoLogin = useCheckMetaforoLogin();

  const [blockType, setBlockType] = useState<BlockContentType>(BlockContentType.Reply);
  const [data, setData] = useState<IProposal>();
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [totalEditCount, setTotalEditCount] = useState<number>(0);
  const [editHistoryList, setEditHistoryList] = useState<EditHistoryType[]>([]);
  const [contentBlocks, setContentBlocks] = useState<IContentBlock[]>([]);
  const currentState = getRealState(data?.state);

  const [applicantSNS, setApplicantSNS] = useState('');
  const [applicantAvatar, setApplicantAvatar] = useState(DefaultAvatarIcon);

  const { getMultiSNS } = useQuerySNS();

  const replyRef = useRef<IReplyOutputProps>(null);

  useEffect(() => {
    if (state) {
      setData(state);
    }
    const getProposalDetail = async () => {
      // TODO
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      try {
        const res = await requests.proposalV2.getProposalDetail(Number(id));
        setData(res.data);
        setContentBlocks(res.data.content_blocks);
        // setPosts(res.data.thread.posts);
        // setTotalPostsCount(res.data.thread.posts_count);
        // setTotalEditCount(res.data.thread.edit_history?.count ?? 0);
        // setEditHistoryList(res.data.thread.edit_history?.lists ?? []);
        const applicant = res.data.applicant;
        setApplicantSNS(publicJs.AddressToShow(applicant));
        setApplicantAvatar(res.data.applicant_avatar || DefaultAvatarIcon);
        if (applicant) {
          try {
            const snsMap = await getMultiSNS([applicant]);
            const name = snsMap.get(applicant.toLocaleLowerCase()) || applicant;
            setApplicantSNS(name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4));
          } catch (error) {}
        }
      } catch (error) {
        logError('get proposal detail error:', error);
      } finally {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      }
    };
    getProposalDetail();
  }, [id, state]);

  const onUpdateStatus = (status: ProposalState) => {
    if (data) {
      const newData: IProposal = { ...data, state: status };
      if (status === ProposalState.Rejected) {
        // TODO
      }
      setData(newData);
      navigate(`/proposal-v2/thread/${id}`);
    }
  };

  const openComment = () => {
    if (blockType !== BlockContentType.Reply) {
      setBlockType(BlockContentType.Reply);
    }
    setTimeout(() => {
      replyRef.current?.showReply();
    }, 0);
    checkMetaforoLogin();
  };

  const handleEdit = () => {
    // TODO
    console.log('edit');
    navigate(`/proposal-v2/edit/${id}`, { state: data });
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
  const currentCategory = () => {
    if (data?.category_name) {
      return data.category_name;
    } else {
      if (data?.proposal_category_id) {
        const findOne = proposalCategories.find((c) => c.id === data.proposal_category_id);
        if (findOne) {
          return findOne.name;
        }
      }
      return t('Proposal.ProposalDetail');
    }
  };

  return (
    <Page>
      <BackerNav title={currentCategory()} to="/proposal-v2" mb="20px" />
      <ThreadHead>
        <div className="title">{data?.title}</div>
        <ThreadCenter>
          <UserBox>
            <img src={applicantAvatar} alt="" />
            <span>{applicantSNS}</span>
            {data?.create_ts && <div className="date">{formatDate(new Date(data?.create_ts * 1000 || ''))}</div>}
          </UserBox>
          <ThreadInfo>{currentState && <ProposalStateTag state={currentState} />}</ThreadInfo>
        </ThreadCenter>
        <StoreHash href={`https://arweave.net/tx/${currentStoreHash}/data.html`} target="_blank">
          Arweave Hash {currentStoreHash}
        </StoreHash>
      </ThreadHead>
      {contentBlocks.map((block) => (
        <ProposalContentBlock key={block.title}>
          <div className="title">{block.title}</div>
          <div className="content">
            <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
          </div>
        </ProposalContentBlock>
      ))}
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
      {/* {data?.polls?.[0] && <ProposalVote poll={data.polls[0]} />} */}
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
        {blockType === BlockContentType.Reply && (
          <ReplyComponent id={Number(id)} hideReply={review} posts={posts} ref={replyRef} />
        )}
        {blockType === BlockContentType.History && <EditActionHistory data={editHistoryList} />}
      </ReplyAndHistoryBlock>
      {review && <ReviewProposalComponent id={Number(id)} onUpdateStatus={onUpdateStatus} />}
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

const ProposalContentBlock = styled.div`
  margin-block: 16px;
  .title {
    background-color: var(--bs-primary);
    line-height: 40px;
    border-radius: 8px;
    color: #fff;
    padding-inline: 16px;
    font-size: 16px;
  }
`;
