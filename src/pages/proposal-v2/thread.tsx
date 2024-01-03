import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent, { IReplyOutputProps } from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';
import { IContentBlock, IProposal, IProposalEditHistoy, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import requests from 'requests';
import { formatDate } from 'utils/time';
import BackerNav from 'components/common/backNav';
import MoreSelectAction from 'components/proposalCom/moreSelectAction';
import { MdEditor, MdPreview } from 'md-editor-rt';
import ProposalStateTag, { getRealState } from 'components/proposalCom/stateTag';
import useProposalCategories from 'hooks/useProposalCategories';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';
import ConfirmModal from 'components/modals/confirmModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import CopyBox from 'components/copy';
import LinkImg from '../../assets/Imgs/proposal/link.png';
import LinkIcon from '../../assets/Imgs/proposal/linkIcon.svg';
import LinkIconDark from '../../assets/Imgs/proposal/linkIcon-black.svg';
import ProfileComponent from '../../profile-components/profile';
import { Preview } from '@seedao/components';
import DataSource from './create/json/datasource.json';
import initialItems from './create/json/initialItem';

import VoteImg from 'assets/Imgs/proposal/vote.svg';
import VoteWhite from 'assets/Imgs/proposal/vote-white.svg';
import ShareImg from 'assets/Imgs/proposal/share.svg';
import ShareWhite from 'assets/Imgs/proposal/share-white.svg';
import CommentImg from 'assets/Imgs/proposal/comment.svg';
import CommentWhite from 'assets/Imgs/proposal/comment-white.svg';

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
    state: { theme, account },
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  const checkMetaforoLogin = useCheckMetaforoLogin();

  const [blockType, setBlockType] = useState<BlockContentType>(BlockContentType.Reply);
  const [data, setData] = useState<IProposal>();
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState<number>(0);
  const [totalEditCount, setTotalEditCount] = useState<number>(0);
  const [editHistoryList, setEditHistoryList] = useState<IProposalEditHistoy[]>([]);
  const [contentBlocks, setContentBlocks] = useState<IContentBlock[]>([]);
  const currentState = getRealState(data?.state);

  const [applicantSNS, setApplicantSNS] = useState('');
  const [applicant, setApplicant] = useState('');
  const [applicantAvatar, setApplicantAvatar] = useState(DefaultAvatarIcon);
  const [showModal, setShowModal] = useState(false);

  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [startPostId, setStartPostId] = useState<number>();

  const { getMultiSNS } = useQuerySNS();

  const replyRef = useRef<IReplyOutputProps>(null);

  const getProposalDetail = async (refreshCurrent?: boolean) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await requests.proposalV2.getProposalDetail(Number(id), startPostId);
      setData(res.data);
      setContentBlocks(res.data.content_blocks);
      // comment
      const newComments = [...posts, ...res.data.comments];
      setPosts(newComments);
      setTotalPostsCount(res.data.comment_count);
      setHasMore(
        newComments.reduce((a, b) => a.children_count + b.children_count) + newComments.length < res.data.comment_count,
      );
      setStartPostId(res.data.comments[res.data.comments.length - 1].id);
      // history
      setTotalEditCount(res.data.histories.total_count ?? 0);
      setEditHistoryList(res.data.histories?.lists ?? []);
      const applicant = res.data.applicant;
      setApplicantSNS(publicJs.AddressToShow(applicant));
      setApplicant(applicant);
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

  useEffect(() => {
    if (state) {
      setData(state);
    }
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
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    requests.proposalV2
      .withdrawProposal(Number(id))
      .then(() => {
        setShowConfirmWithdraw(false);
        setData({ ...data!, state: ProposalState.Withdrawn });
      })
      .catch((error: any) => {
        logError(`withdrawProposal-${id} failed`, error);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const handleClickMoreAction = (action: string) => {
    switch (action) {
      case 'edit':
        handleEdit();
        break;
      case 'withdrawn':
        setShowConfirmWithdraw(true);
        break;
    }
  };

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

  const showVote = () => {
    if (!data?.votes?.[0]) {
      return false;
    }
    if (
      [ProposalState.Rejected, ProposalState.Withdrawn, ProposalState.PendingSubmit, ProposalState.Draft].includes(
        data?.state,
      )
    ) {
      return false;
    }
    return true;
  };

  const isCurrentApplicant = data?.applicant?.toLocaleLowerCase() === account?.toLocaleLowerCase();

  const moreActions = () => {
    if (!data) {
      return [];
    }

    const actions: { label: string; value: string }[] = [];
    if ([ProposalState.Rejected, ProposalState.Withdrawn].includes(data?.state)) {
      actions.push({ label: t('Proposal.Edit'), value: 'edit' });
    }
    if (data?.state === ProposalState.Draft) {
      actions.push({ label: t('Proposal.Withdrawn'), value: 'withdrawn' });
    }
    return actions;
  };

  const getNextCommentList = () => {
    if (!posts.length) {
      return;
    }
    const lastCommentId = posts[posts.length - 1].id;
    getProposalDetail(lastCommentId);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleProfile = () => {
    setShowModal(true);
  };

  return (
    <Page>
      <FixedBox>
        <FlexInner>
          <BackerNav title={currentCategory()} to="/proposal-v2" mb="0" />
          <FlexRht>
            {isCurrentApplicant && !!moreActions().length && (
              <EditBox>
                {moreActions().map((item, index) => (
                  <li key={index} onClick={() => handleClickMoreAction(item.value)}>
                    {item.label}
                  </li>
                ))}
              </EditBox>
            )}
            <ThreadToolsBar>
              {showVote() && (
                <li>
                  <img src={theme ? VoteWhite : VoteImg} alt="" />
                  {t('Proposal.Vote')}
                </li>
              )}
              <li onClick={openComment}>
                <img src={theme ? CommentWhite : CommentImg} alt="" />
                {t('Proposal.Comment')}
              </li>
              <li>
                <CopyBox dir="left" text={`${window.location.origin}/proposal-v2/thread/${id}`}>
                  <img src={theme ? ShareWhite : ShareImg} alt="" />
                  {t('Proposal.Share')}
                </CopyBox>
              </li>
              {/*{isCurrentApplicant && !!moreActions().length && (*/}
              {/*  <li>*/}
              {/*    <MoreSelectAction options={moreActions()} handleClickAction={handleClickMoreAction} />*/}
              {/*  </li>*/}
              {/*)}*/}
            </ThreadToolsBar>
          </FlexRht>
        </FlexInner>
      </FixedBox>

      <ThreadHead>
        <div className="title">{data?.title}</div>
        <FlexLine>
          <ThreadInfo>{currentState && <ProposalStateTag state={currentState} />}</ThreadInfo>
          <CatBox>{currentCategory()}</CatBox>
        </FlexLine>
        {showModal && <ProfileComponent address={applicant} theme={theme} handleClose={handleClose} />}
        <ThreadCenter>
          <UserBox onClick={() => handleProfile()}>
            <img src={applicantAvatar} alt="" />
            <span className="name">{applicantSNS}</span>
            {data?.create_ts && <div className="date">{formatDate(new Date(data?.create_ts * 1000 || ''))}</div>}
          </UserBox>
        </ThreadCenter>
        {data?.arweave && (
          <StoreHash>
            <div className="lft">
              <img src={LinkImg} alt="" /> <span>Arweave Hash</span>
            </div>
            <div className="rht">
              <a href={`https://arweave.net/tx/${data?.arweave}/data.html`} target="_blank" rel="noreferrer">
                {data?.arweave}
              </a>
              <img src={!theme ? LinkIconDark : LinkIcon} alt="" />
            </div>
          </StoreHash>
        )}
      </ThreadHead>

      {data?.is_rejected && data?.reject_reason && data?.reject_ts && (
        <RejectBlock>
          <RejectLine>
            <span className="rejectTit">{t('Proposal.CityhallRejected')}</span>
            <span className="time">{formatDate(new Date(data.reject_ts * 1000))}</span>
          </RejectLine>
          <div className="desc">{data.reject_reason}</div>
        </RejectBlock>
      )}
      <ContentOuter>
        <Preview
          DataSource={DataSource}
          // language={i18n.language}
          initialItems={initialItems}
          theme={theme}
          BeforeComponent={
            <>
              {contentBlocks.map((block) => (
                <ProposalContentBlock key={block.title}>
                  <div className="title">{block.title}</div>
                  <div className="content">
                    <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
                  </div>
                </ProposalContentBlock>
              ))}
              <ComponnentBox>
                <div className="title">提案标题</div>
              </ComponnentBox>
            </>
          }
          AfterComponent={contentBlocks.map((block) => (
            <ProposalContentBlock key={block.title}>
              <div className="title">{block.title}</div>
              <div className="content">
                <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
              </div>
            </ProposalContentBlock>
          ))}
        />
      </ContentOuter>

      <CardStyle>
        {showVote() && <ProposalVote poll={data!.votes[0]} id={Number(id)} updateStatus={getProposalDetail} />}

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
            <InfiniteScroll
              scrollableTarget="scrollableDiv"
              dataLength={posts.length}
              next={getNextCommentList}
              hasMore={hasMore}
              loader={<></>}
            >
              <ReplyComponent
                pinId={1964525} // TODO hardcode for test pin comment
                id={Number(id)}
                hideReply={review}
                posts={posts}
                ref={replyRef}
                onNewComment={getProposalDetail}
              />
            </InfiniteScroll>
          )}

          {blockType === BlockContentType.History && <EditActionHistory data={editHistoryList} />}
        </ReplyAndHistoryBlock>

        {showConfirmWithdraw && (
          <ConfirmModal
            msg={t('Proposal.ConfirmWithdrawProposal')}
            onClose={() => setShowConfirmWithdraw(false)}
            onConfirm={handlWithdraw}
          />
        )}
      </CardStyle>

      {review && (
        <AuditBox>
          <ReviewProposalComponent id={Number(id)} onUpdateStatus={onUpdateStatus} />
        </AuditBox>
      )}
    </Page>
  );
}

const FlexRht = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const EditBox = styled.ul`
  background-color: var(--bs-box-background);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 24px;
  font-size: 14px;
  margin-right: 8px;
  li {
    color: var(--bs-primary);
  }
`;

const FlexInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 100%;
`;
const FixedBox = styled.div`
  background-color: var(--bs-box-background);
  position: sticky;
  margin: -24px 0 0 -32px;
  width: calc(100% + 64px);
  top: 0;
  height: 64px;
  z-index: 95;
  box-sizing: border-box;
  box-shadow: var(--proposal-box-shadow);
  border-top: 1px solid var(--bs-border-color);
  svg {
  }
`;
const AuditBox = styled.div`
  margin: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Page = styled.div`
  ${ContainerPadding};
`;

const ReplyAndHistoryBlock = styled.div`
  margin-top: 20px;
`;

const BlockTab = styled.ul`
  display: flex;
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--bs-body-color_active);

  li {
    cursor: pointer;
    margin-right: 24px;
    font-size: 16px;
    font-weight: bold;
  }
  li.selected {
    color: var(--bs-primary);
  }
`;

const ThreadCenter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
  }
`;

const ThreadHead = styled.div`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-bottom: 24px;
  padding: 32px;
  border-radius: 8px;
  margin-top: 30px;
  .title {
    font-size: 24px;
    font-family: 'Poppins-Medium';
    color: var(--bs-body-color_active);
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
    margin-left: 16px;
    font-size: 12px;
  }
`;

const CardStyle = styled.div`
  font-size: 14px;
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  border-radius: 8px !important;
  padding: 32px;
`;

const ThreadInfo = styled.div``;

const StoreHash = styled.div`
  display: flex;
  align-items: center;
  a {
    color: #2f8fff;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
  .lft {
    color: var(--bs-body-color_active);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    margin-right: 8px;
    img {
      margin-right: 8px;
    }
  }
  .rht {
    display: flex;
    align-content: center;
    img {
      margin-left: 8px;
    }
  }
`;

const ThreadToolsBar = styled.ul`
  background-color: var(--bs-box-background);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 24px;

  li {
    cursor: pointer;
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
  img {
    margin-right: 10px;
  }
`;

const ProposalContentBlock = styled.div`
  margin-block: 16px;
  .title {
    background: rgba(82, 0, 255, 0.08);
    line-height: 40px;
    border-radius: 4px;
    color: var(--bs-body-color_active);
    padding-inline: 16px;
    font-size: 16px;
  }
`;

const ComponnentBox = styled(ProposalContentBlock)`
  margin-bottom: 0;
`;

const RejectBlock = styled.div`
  border-radius: 8px;
  background: rgba(251, 78, 78, 0.1);
  padding: 16px 32px;
  .desc {
    color: var(--bs-body-color_active);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
`;
const CatBox = styled.div`
  border-radius: 4px;
  border: 1px solid var(--bs-border-color_opacity);
  margin-right: 10px;
  color: var(--bs-body-color_active);
  font-size: 12px;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  margin-left: 16px;
  box-sizing: border-box;
`;
const RejectLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .rejectTit {
    color: #fb4e4e;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
  .time {
    color: #bbb;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }
`;
const ContentOuter = styled.div`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-bottom: 24px;
  padding: 32px;
  border-radius: 8px;
`;
