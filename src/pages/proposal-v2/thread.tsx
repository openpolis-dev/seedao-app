import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote from 'components/proposalCom/vote';
import ReplyComponent, { IReplyOutputProps } from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';
import { ICommentDisplay, IContentBlock, IProposal, IProposalEditHistoy, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import requests from 'requests';
import { formatTime } from 'utils/time';
import BackerNav from 'components/common/backNav';
import { MdPreview } from 'md-editor-rt';
import ProposalStateTag, { getRealState } from 'components/proposalCom/stateTag';
import useProposalCategories from 'hooks/useProposalCategories';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';
import DefaultAvatarIcon from 'assets/Imgs/defaultAvatar.png';
import ConfirmModal from 'components/modals/confirmModal';
import CopyBox from 'components/copy';
import ProfileComponent from '../../profile-components/profile';
import { Preview } from '@seedao/components';

import VoteImg from 'assets/Imgs/proposal/vote.svg';
import VoteWhite from 'assets/Imgs/proposal/vote-white.svg';
import ShareImg from 'assets/Imgs/proposal/share.svg';
import ShareWhite from 'assets/Imgs/proposal/share-white.svg';
import CommentImg from 'assets/Imgs/proposal/comment.svg';
import CommentWhite from 'assets/Imgs/proposal/comment-white.svg';
import { DeletedContent } from 'components/proposalCom/comment';
import useToast, { ToastType } from 'hooks/useToast';
import CategoryTag from 'components/proposalCom/categoryTag';
import TemplateTag from 'components/proposalCom/templateTag';

enum BlockContentType {
  Reply = 1,
  History,
}

export default function ThreadPage() {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const review = pathname.includes('review-proposal');
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const {
    dispatch,
    state: { theme, account },
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  const { checkMetaforoLogin } = useCheckMetaforoLogin();

  const [blockType, setBlockType] = useState<BlockContentType>(BlockContentType.Reply);
  const [data, setData] = useState<IProposal>();
  // const [posts, setPosts] = useState<any[]>([]);
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
  const [components, setComponents] = useState<any[]>([]);
  const [commentsArray, setCommentsArray] = useState<ICommentDisplay[][]>([]);
  const [currentCommentArrayIdx, setCurrentCommentArrayIdx] = useState<number>(0);
  const [dataSource, setDatasource] = useState<any>();

  const posts = commentsArray.length ? commentsArray.reduce((a, b) => [...a, ...b], []) : [];

  const { getMultiSNS } = useQuerySNS();
  const { showToast } = useToast();

  const replyRef = useRef<IReplyOutputProps>(null);

  const getProposalDetail = async (refreshIdx?: number) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let res: { data: IProposal };
      if (refreshIdx !== void 0) {
        // refresh the pointed group array
        let start_post_id: undefined | number;
        if (refreshIdx === 0) {
          start_post_id = undefined;
        } else {
          const _arr = commentsArray[refreshIdx - 1];
          start_post_id = _arr[_arr.length - 1].metaforo_post_id;
        }
        res = await requests.proposalV2.getProposalDetail(Number(id), start_post_id);
      } else {
        const _arr = commentsArray[currentCommentArrayIdx];
        res = await requests.proposalV2.getProposalDetail(
          Number(id),
          _arr ? _arr[_arr.length - 1]?.metaforo_post_id : undefined,
        );
      }
      setData(res.data);

      setContentBlocks(res.data.content_blocks);
      const comStr = res.data.components || [];
      comStr.map((item: any) => {
        if (typeof item.data === 'string') {
          item.data = JSON.parse(item.data);
        }
        return item;
      });
      setDatasource(comStr ?? []);
      // comment

      if (refreshIdx !== void 0) {
        const _new_arr = [...commentsArray];
        _new_arr[currentCommentArrayIdx] = res.data.comments?.map((c) => ({
          ...c,
          bindIdx: currentCommentArrayIdx,
          children: c.children?.map((c) => ({ ...c, bindIdx: currentCommentArrayIdx })),
        }));
        setCommentsArray(_new_arr);
      } else if (res.data.comments?.length) {
        const new_idx = commentsArray.length;
        setCurrentCommentArrayIdx(new_idx);

        const new_arr = [
          ...commentsArray,
          res.data.comments?.map((c) => ({
            ...c,
            bindIdx: new_idx,
            children: c.children?.map((c) => ({ ...c, bindIdx: currentCommentArrayIdx })),
          })) || [],
        ];
        setCommentsArray(new_arr);
        // check if has more
        const all_comments = new_arr.length ? new_arr.reduce((a, b) => [...a, ...b], []) : [];
        let now_count: number = all_comments.length;
        all_comments.forEach((item) => (now_count += item.children?.length || 0));
        setHasMore(all_comments.length === 0 ? false : now_count < res.data.comment_count);
        getMultiSNS(Array.from(new Set(all_comments.map((item) => item.wallet))));
      }
      setTotalPostsCount(res.data.comment_count);

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
    } catch (error: any) {
      logError('get proposal detail error:', error);
      showToast(error?.data?.msg || error?.code || error, ToastType.Danger, { autoClose: false });
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    if (state) {
      setData(state);
    }
    getProposalDetail();
    getComponentsList();
  }, [id, state]);

  const getComponentsList = async () => {
    // NOTE: getProposalDetail may use more time, so not show loading here
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposalV2.getComponents();
      let components = resp.data;

      components?.map((item: any) => {
        if (typeof item.schema === 'string') {
          item.schema = JSON.parse(item.schema);
        }
        return item;
      });

      setComponents(resp.data);
    } catch (error) {
      logError('getAllProposals failed', error);
    } finally {
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const onUpdateStatus = (status: ProposalState) => {
    if (data) {
      // back to review list
      navigate('/city-hall/governance/review-proposal');
    }
  };

  const go2vote = () => {
    document.querySelector('#vote-block')?.scrollIntoView();
  };

  const openComment = () => {
    if (blockType !== BlockContentType.Reply) {
      setBlockType(BlockContentType.Reply);
    }
    setTimeout(() => {
      replyRef.current?.showReply();
      document.querySelector('#reply-history-block')?.scrollIntoView();
    }, 0);
    checkMetaforoLogin();
  };

  const handleEdit = () => {
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
    if ([ProposalState.Rejected, ProposalState.Withdrawn, ProposalState.PendingSubmit].includes(data?.state)) {
      actions.push({ label: t('Proposal.Edit'), value: 'edit' });
    }
    if (data?.state === ProposalState.Draft) {
      actions.push({ label: t('Proposal.Withdrawn'), value: 'withdrawn' });
    }
    return actions;
  };

  const onEditComment = (idx?: number) => {
    if (idx !== void 0) {
      getProposalDetail(idx);
    }
  };

  const onDeleteComment = (cid: number, bindIdx: number) => {
    const _new_arr = [...commentsArray];
    for (const item of _new_arr[bindIdx]) {
      let flag = false;
      if (item.metaforo_post_id === cid) {
        item.content = DeletedContent;
        item.deleted = 1;
        break;
      }
      for (const childItem of item.children || []) {
        if (childItem.metaforo_post_id === cid) {
          childItem.content = DeletedContent;
          childItem.deleted = 1;
          flag = true;
          break;
        }
      }
      if (flag) {
        break;
      }
    }
    setCommentsArray(_new_arr);
  };

  const getNextCommentList = () => {
    if (!posts.length) {
      return;
    }
    getProposalDetail();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleProfile = () => {
    setShowModal(true);
  };

  return (
    <Page>
      {review ? (
        <BackerNav title={t('Proposal.ProposalDetail')} to={'/city-hall/governance/review-proposal'} mb="0" />
      ) : (
        <FixedBox>
          <FlexInner>
            <BackerNav title={currentCategory()} to={'/proposal-v2'} state={state} mb="0" />

            <FlexRht>
              {!review && isCurrentApplicant && !!moreActions().length && (
                <EditBox>
                  {moreActions().map((item, index) => (
                    <li key={index} onClick={() => handleClickMoreAction(item.value)}>
                      {item.label}
                    </li>
                  ))}
                </EditBox>
              )}
              {data?.state !== ProposalState.PendingSubmit && (
                <ThreadToolsBar>
                  {showVote() && (
                    <li onClick={go2vote}>
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
              )}
            </FlexRht>
          </FlexInner>
        </FixedBox>
      )}

      <ThreadHead>
        <div className="title">{data?.title}</div>
        <FlexLine>
          {currentState && <ProposalStateTag state={currentState} />}
          <CategoryTag>{currentCategory()}</CategoryTag>
          {review && data?.template_name && <TemplateTag>{data?.template_name}</TemplateTag>}
          {data?.arweave && (
            <StoreHash href={`https://arweave.net/tx/${data?.arweave}/data.html`} target="_blank" rel="noreferrer">
              a
            </StoreHash>
          )}
        </FlexLine>
        {showModal && <ProfileComponent address={applicant} theme={theme} handleClose={handleClose} />}
        <UserBox onClick={() => handleProfile()}>
          <img src={applicantAvatar} alt="" />
          <span className="name">{applicantSNS}</span>
          {data?.create_ts && <div className="date">{formatTime(data.create_ts * 1000)}</div>}
        </UserBox>
      </ThreadHead>

      {data?.is_rejected && data?.reject_reason && data?.reject_ts && (
        <RejectBlock>
          <RejectLine>
            <span className="rejectTit">{t('Proposal.CityhallRejected')}</span>
            <span className="time">{formatTime(data.reject_ts * 1000)}</span>
          </RejectLine>
          <div className="desc">{data.reject_reason}</div>
        </RejectBlock>
      )}
      <ContentOuter>
        <Preview
          DataSource={dataSource}
          language={i18n.language}
          initialItems={components}
          theme={theme}
          BeforeComponent={
            !!dataSource?.length && (
              <ComponnentBox>
                <div className="title">{t('Proposal.proposalComponents')}</div>
              </ComponnentBox>
            )
          }
          AfterComponent={contentBlocks.map((block, i) => (
            <ProposalContentBlock key={block.title} $radius={i === 0 && !dataSource?.length ? '4px 4px 0 0' : '0'}>
              <div className="title">{block.title}</div>
              <div className="content">
                <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
              </div>
            </ProposalContentBlock>
          ))}
        />
      </ContentOuter>
      {data?.state !== ProposalState.PendingSubmit && (
        <>
          <CardStyle>
            {showVote() && (
              <ProposalVote
                voteGate={data?.vote_gate}
                poll={data!.votes[0]}
                id={Number(id)}
                updateStatus={getProposalDetail}
              />
            )}

            <ReplyAndHistoryBlock>
              <BlockTab id="reply-history-block">
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
                <ReplyComponent
                  pinId={data?.reject_metaforo_comment_id}
                  id={Number(id)}
                  hideReply={review}
                  posts={posts}
                  ref={replyRef}
                  onNewComment={() => onEditComment(currentCommentArrayIdx)}
                  onEditComment={onEditComment}
                  getNextCommentList={getNextCommentList}
                  onDeleteComment={onDeleteComment}
                  hasMore={hasMore}
                />
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
        </>
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
    cursor: pointer;
    &:hover {
      color: var(--bs-body-color_active);
    }
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
  margin-bottom: 32px;
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

const ThreadHead = styled.div`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-bottom: 24px;
  padding: 16px 32px;
  border-radius: 8px;
  margin-top: 24px;
  .title {
    font-size: 24px;
    font-family: 'Poppins-Bold';
    color: var(--bs-body-color_active);
    line-height: 30px;
    letter-spacing: 0.12px;
  }
`;

const UserBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
  }
  .date {
    margin-left: 16px;
    font-size: 12px;
  }
  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
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

const StoreHash = styled.a`
  color: var(--bs-body-color);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 15px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid var(--bs-body-color);
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

const ProposalContentBlock = styled.div<{ $radius?: string }>`
  margin-bottom: 16px;
  .title {
    background: rgba(82, 0, 255, 0.08);
    line-height: 40px;
    border-radius: ${(props) => props.$radius || '4px 4px 0 0'};
    color: var(--bs-body-color_active);
    padding-inline: 32px;
    font-size: 16px;
    font-family: 'Poppins-SemiBold';
  }
  .content .md-editor-preview-wrapper {
    padding-inline: 32px;
  }
`;

const ComponnentBox = styled(ProposalContentBlock)`
  margin-bottom: 0;
`;

const RejectBlock = styled.div`
  border-radius: 8px;
  background: rgba(251, 78, 78, 0.1);
  padding: 16px 32px;
  margin-bottom: 20px;
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
  margin: 10px 0;
  gap: 16px;
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
  border-radius: 8px;
`;
