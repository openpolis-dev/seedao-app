import styled from 'styled-components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import ProposalVote, { getPollStatus } from 'components/proposalCom/vote';
import ReplyComponent, { IReplyOutputProps } from 'components/proposalCom/reply';
import ReviewProposalComponent from 'components/proposalCom/reviewProposalComponent';
import EditActionHistory from 'components/proposalCom/editActionhistory';
import {
  ICommentDisplay,
  IContentBlock,
  IProposal,
  IProposalEditHistoy,
  ProposalState,
  VoteType,
  VoteOptionType,
} from 'type/proposalV2.type';
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
import { Preview } from '@taoist-labs/components';

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
import PlusImg from '../../assets/Imgs/light/plus.svg';
import MinusImg from '../../assets/Imgs/light/minus.svg';
import { formatDeltaDate } from 'utils/time';
import { getProposalSIPSlug } from 'utils';
import useQueryUser from 'hooks/useQueryUser';
import defaultImg from '../../assets/Imgs/defaultAvatar.png';
import getConfig from "../../utils/envCofnig";
import { useNetwork } from "wagmi";

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
    state: { theme, metaforoToken,account, userData },
  } = useAuthContext();
  const proposalCategories = useProposalCategories();
  const { checkMetaforoLogin } = useCheckMetaforoLogin();
  // const [voteType, setVoteType] = useState<number>(0);

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
  const [componentName, setComponentName] = useState('');
  const [beforeList, setBeforeList] = useState<IContentBlock[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [previewTitle, setPreviewTitle] = useState('');

  const [voteList, setVoteList] = useState(['']);

  const [dataSource, setDatasource] = useState<any>();

  const posts = commentsArray.length ? commentsArray.reduce((a, b) => [...a, ...b], []) : [];

  const { getMultiSNS } = useQuerySNS();
  const { getUsers } = useQueryUser();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<any>(null);

  const replyRef = useRef<IReplyOutputProps>(null);

  const { chain } = useNetwork();
  useEffect(() => {
    if(metaforoToken || !account || !userData || !chain)return;
    getMetaforo()
  }, [metaforoToken,account,userData,chain]);
  const getMetaforo = async()=>{
    await checkMetaforoLogin();
  }

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

      const { associated_project_budgets: budgets } = res.data;

      let data: any = {};

      let total: string[] = [];
      let ratio: string[] = [];
      let paid: string[] = [];
      let remainAmount: string[] = [];
      let prepayTotal: string[] = [];
      let prepayRemain: string[] = [];

      budgets?.map((item: any) => {
        total.push(`${item.total_amount} ${item.asset_name}`);
        ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
        paid.push(`${item.used_advance_amount} ${item.asset_name}`);
        remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
        prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
        prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
      });

      data.total = total.join(',');
      data.ratio = ratio.join(',');
      data.paid = paid.join(',');
      data.remainAmount = remainAmount.join(',');
      data.prepayTotal = prepayTotal.join(',');
      data.prepayRemain = prepayRemain.join(',');
      setDetail(data);

      const arr = res.data.content_blocks;
      const componentsIndex = arr.findIndex((i: any) => i.type === 'components');

      const beforeComponents = arr.filter(
        (item: any) => item.type !== 'components' && item.type !== 'preview' && arr.indexOf(item) < componentsIndex,
      );
      let componentsList = arr.filter((item: any) => item.type === 'components') || [];
      const afterComponents = arr.filter(
        (item: any) => item.type !== 'components' && item.type !== 'preview' && arr.indexOf(item) > componentsIndex,
      );

      // setVoteType(res.data.vote_type || 0);
      const preview = arr.filter((i: any) => i.type === 'preview');

      if (preview.length) {
        const preArr = preview[0]?.content ? JSON.parse(preview[0]?.content) : '';
        setPreview(preArr);
        setPreviewTitle(preview[0].title);
      }

      setComponentName(componentsList[0]?.title);
      setBeforeList(beforeComponents ?? []);

      setContentBlocks(afterComponents);

      const comStr = res.data.components || [];
      comStr.map((item: any) => {
        if (item.data && typeof item.data === 'string') {
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
        const query_wallets = Array.from(new Set(all_comments.map((item) => item.wallet)));
        getMultiSNS(query_wallets);
        getUsers(query_wallets);
      }
      setTotalPostsCount(res.data.comment_count);

      // history
      setTotalEditCount(res.data.histories.total_count ?? 0);
      setEditHistoryList(res.data.histories?.lists ?? []);
      const applicant = res.data.applicant;
      setApplicantSNS(publicJs.AddressToShow(applicant));
      setApplicant(applicant);

      setApplicantAvatar(res.data.applicant_avatar);
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
    navigate(`/proposal/edit/${id}`, { state: data });
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
        showToast(error?.data?.msg || error?.code || error, ToastType.Danger, { autoClose: false });
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const handleClickMoreAction = async (action: string) => {
    const canOperate = await checkMetaforoLogin();
    if (!canOperate) {
      return;
    }
    switch (action) {
      case 'edit':
        handleEdit();
        break;
      case 'withdrawn':
        setShowConfirmWithdraw(true);
        break;
    }
  };

  const getCurrentCategory = () => {
    if (data?.category_name) {
      return data.category_name;
    } else {
      if (data?.proposal_category_id) {
        const findOne = proposalCategories?.find((c) => c.id === data.proposal_category_id);
        if (findOne) {
          return findOne.name;
        }
      }
      return '';
    }
  };
  const currentCategory = getCurrentCategory();

  const showVote = () => {
    if (!data?.votes?.[0]) {
      return false;
    }
    if (
      [ProposalState.Rejected, ProposalState.Withdrawn, ProposalState.PendingSubmit, ProposalState.Draft].includes(
        data?.state,
      ) &&
      data.vote_type !== 99 &&
      data.vote_type !== 98
    ) {
      return false;
    }
    return true;
  };

  const showVotedTag = (currentState:ProposalState | undefined) =>{
    if (!data?.votes?.[0]) {
      return false;
    }
    const votedItem = data?.votes?.[0].options.filter((item)=>item.is_vote);

    return (!!votedItem?.length &&  currentState === "voting" && !!metaforoToken)
  }

  const showVotedNot = (currentState:ProposalState | undefined) =>{
    if (!data?.votes?.[0]) {
      return false;
    }
    const votedItem = data?.votes?.[0].options.filter((item)=>item.is_vote);

    return (!votedItem?.length &&  currentState === "voting"&& !!metaforoToken)
  }

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

  const applicantData = useMemo(() => {
    applicant &&
      requests.user.getUsers([applicant]).then((r) => {
        setApplicantAvatar(r.data[0]?.sp?.avatar);
      });
  }, [applicant]);

  const getTimeTagDisplay = () => {
    if (data?.state === ProposalState.Draft) {
      if (!data?.publicity_ts) {
        return null;
      }
      return (
        <TimeTag>
          {t('Proposal.DraftEndAt', {
            leftTime: t('Proposal.TimeDisplay', {
              ...formatDeltaDate(new Date((data?.publicity_ts || 0) * 1000).getTime()),
            }),
          })}
        </TimeTag>
      );
    }
    if (data?.state === ProposalState.PendingExecution) {
      if (data?.execution_ts && data?.execution_ts * 1000 > Date.now()) {
        return (
          <TimeTag>
            {t('Proposal.AutoExecuteLeftTime', {
              ...formatDeltaDate((data?.execution_ts || 0) * 1000),
            })}
          </TimeTag>
        );
      }
    }
    const poll = data?.votes?.[0];
    if (!poll) {
      return;
    }
    if (data?.state === ProposalState.Voting) {
      const pollStatus = getPollStatus(poll.poll_start_at, poll.close_at);
      if (pollStatus === VoteType.Open) {
        return (
          <TimeTag>
            {t('Proposal.VoteEndAt', {
              leftTime: t('Proposal.TimeDisplay', { ...formatDeltaDate(new Date(poll.close_at).getTime()) }),
            })}
          </TimeTag>
        );
      }
    }
  };

  return (
    <Page>
      {review ? (
        <BackerNav title={t('Proposal.ProposalDetail')} to={'/city-hall/governance/review-proposal'} mb="0" />
      ) : (
        <FixedBox>
          <FlexInner>
            {/*<BackerNav title={currentCategory || t('Proposal.ProposalDetail')} to={'/proposal'} state={state} mb="0" />*/}
            <BackerNav
              title={currentCategory || t('Proposal.ProposalDetail')}
              to=""
              onClick={() => navigate(-1)}
              state={state}
              mb="0"
            />

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
                    <CopyBox dir="left" text={`${window.location.origin}/proposal/thread/${id}`}>
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
        <div className="title">
          {getProposalSIPSlug(data?.sip)}
          {data?.title}
        </div>
        <FlexLine>
          {showVotedTag(currentState) &&  <VotedBox>{t('Proposal.HasVote')}</VotedBox>}
          {showVotedNot(currentState) &&  <VotedBox2>{t('Proposal.notVote')}</VotedBox2>}
          {currentCategory && <CategoryTag>{currentCategory}</CategoryTag>}
          {!data?.is_based_on_custom_template && <TemplateTag>{data?.template_name}</TemplateTag>}

          {currentState && <ProposalStateTag state={currentState} />}

          {getTimeTagDisplay()}


        </FlexLine>
        {showModal && <ProfileComponent address={applicant} theme={theme} handleClose={handleClose} />}
        <InfoBox>
          <UserBox onClick={() => handleProfile()}>
            <img src={applicantAvatar ? applicantAvatar : defaultImg} alt="" />
            <span className="name">{applicantSNS}</span>
          </UserBox>
          {data?.create_ts && <div className="date">{formatTime(data.create_ts * 1000)}</div>}
          {data?.arweave && (
            <StoreHash href={`https://arweave.net/tx/${data?.arweave}/data.html`} target="_blank" rel="noreferrer">
              a
            </StoreHash>
          )}
        </InfoBox>
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
          rpc={getConfig().NETWORK.rpcs[0]}
          DataSource={JSON.parse(JSON.stringify(dataSource || []))}
          language={i18n.language}
          initialItems={components}
          theme={theme}
          key="preview_main"
          BeforeComponent={
            <>
              {!!preview?.length && (
                <>
                  <ProposalContentBlock>
                    <div className="title">{previewTitle}</div>
                    <div className="constentPreview">
                      <Preview
                        DataSource={JSON.parse(JSON.stringify(preview || []))}
                        key="preview_inner"
                        language={i18n.language}
                        initialItems={components}
                        theme={theme}
                      />
                    </div>
                  </ProposalContentBlock>
                </>
              )}
              {!!beforeList?.length &&
                beforeList.map((block, i) => (
                  <ProposalContentBlock
                    key={block.title}
                    $radius={i === 0 && !dataSource?.length ? '4px 4px 0 0' : '0'}
                  >
                    <div className="title">{block.title}</div>
                    <div className="content">
                      <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
                    </div>
                  </ProposalContentBlock>
                ))}
              {!!dataSource?.length && (
                <ComponnentBox>
                  <div className="title">{componentName || t('Proposal.proposalComponents')}</div>
                </ComponnentBox>
              )}
              {!!dataSource?.length && componentName === '激励申请表' && dataSource[0].name === 'motivation' && (
                <DisplayBox>
                  <div className="titl">当前可申请资产: {detail?.remainAmount}</div>
                  <div className="content">
                    <dl>
                      <dt>项目预算</dt>
                      <dd> {detail?.total}</dd>
                    </dl>
                    <dl>
                      <dt>预付比例</dt>
                      <dd>{detail?.ratio}</dd>
                    </dl>
                    <dl>
                      <dt>总可预支</dt>
                      <dd> {detail?.prepayTotal}</dd>
                    </dl>
                    <dl>
                      <dt>当前已预支</dt>
                      <dd>{detail?.paid}</dd>
                    </dl>
                    <dl>
                      <dt>预算余额</dt>
                      <dd>{detail?.remainAmount}</dd>
                    </dl>
                    <dl>
                      <dt>可预支余额</dt>
                      <dd>{detail?.prepayRemain}</dd>
                    </dl>
                  </div>
                </DisplayBox>
              )}
            </>
          }
          AfterComponent={
            <>
              {!!contentBlocks?.length &&
                contentBlocks?.map((block, i) => (
                  <ProposalContentBlock
                    key={`ProposalContentBlock_${block.title}_${i}`}
                    $radius={i === 0 && !dataSource?.length ? '4px 4px 0 0' : '0'}
                  >
                    <div className="title">{block.title}</div>
                    <div className="content">
                      <MdPreview theme={theme ? 'dark' : 'light'} modelValue={block.content || ''} />
                    </div>
                  </ProposalContentBlock>
                ))}
              {data?.state === ProposalState.PendingSubmit && (data?.vote_type === 99 || data?.vote_type === 98) && (
                <ItemBox>
                  <TitleBox>投票选项</TitleBox>
                  <VoteBox>
                    {!!data?.os_vote_options?.length &&
                      data?.os_vote_options?.map((item) => <li key={item.id}>{item.label}</li>)}
                  </VoteBox>
                </ItemBox>
              )}
              {/*{*/}
              {/*    <ItemBox>*/}
              {/*   */}
              {/*    <VoteBox>*/}
              {/*      {voteList.map((item:string, index) => (*/}
              {/*        <li>*/}
              {/*          <input type="checkbox" id={`vote_${index}`} />*/}
              {/*          <label htmlFor={`vote_${index}`}>{item}</label>*/}
              {/*        </li>*/}
              {/*      ))}*/}
              {/*    </VoteBox>*/}
              {/*  </ItemBox>*/}
              {/*}*/}
            </>
          }
        />
      </ContentOuter>

      {data?.state !== ProposalState.PendingSubmit && (
        <>
          <CardStyle>
            {showVote() && (
              <ProposalVote
                proposalState={data!.state}
                execution_ts={data?.execution_ts}
                voteGate={data?.vote_gate}
                poll={data!.votes[0]}
                id={Number(id)}
                currentState={currentState}
                showMultiple={data!.is_multiple_vote}
                updateStatus={getProposalDetail}
                isOverrideProposal={data!.template_name === '否决提案'}
                voteOptionType={data!.vote_type as VoteOptionType}
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

const DisplayBox = styled.div`
  background: var(--home-right);
  margin: 10px 30px;
  padding: 20px 20px 10px;
  border-radius: 10px;
  .titl {
    font-size: 16px;
    font-weight: 600;
    color: var(--bs-body-color_active);
    margin-bottom: 20px;
    text-transform: capitalize;
  }
  .content {
    font-size: 14px;
    color: var(--bs-body-color_active);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    text-transform: capitalize;
    dl {
      width: 33.333%;
      display: flex;

      align-items: center;
      margin-bottom: 10px;
      dt {
        margin-right: 20px;
        min-width: 70px;
        font-weight: normal;
      }
    }
  }
`;

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

const ReplyAndHistoryBlock = styled.div``;

const BlockTab = styled.ul`
  display: flex;
  font-size: 20px;
  margin-bottom: 20px;
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

const InfoBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  .date {
    font-size: 12px;
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

  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: var(--bs-body-color_active);
    cursor: default;
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
  &:hover {
    color: #2f8fff;
    border: 1px solid #2f8fff;
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

const ProposalContentBlock = styled.div<{ $radius?: string }>`
  margin-bottom: 16px;
  .title {
    background: rgba(82, 0, 255, 0.08);
    line-height: 40px;

    color: var(--bs-body-color_active);
    padding-inline: 32px;
    font-size: 16px;
    font-family: 'Poppins-SemiBold';
  }
  .content .md-editor-preview-wrapper {
    padding-inline: 32px;
  }
  .constentPreview {
    margin-top: 20px;
  }
`;

const ComponnentBox = styled(ProposalContentBlock)`
  margin-bottom: 20px;
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

const VoteBox = styled.ul`
  padding: 0 32px;
  li {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--proposal-border);
    height: 40px;
    border-radius: 8px;
    padding: 0 16px;
    label {
      cursor: pointer;
    }
  }
`;

const ItemBox = styled.div`
  margin-bottom: 20px;
`;

const TitleBox = styled.div`
  background: rgba(82, 0, 255, 0.08);
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  box-sizing: border-box;
`;
const StatusTag = styled.div`
  background-color: #fb4e4e;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
  padding: 0 20px;
`;

const TimeTag = styled.span`
  color: var(--bs-primary);
  font-size: 12px;
`;
const VotedBox = styled.div`
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #08D0EA30;
    color: #08b0c5;
    font-size: 12px;
    background: #08D0EA30;
    padding: 0 16px;
    line-height: 24px;
    text-align: center;
`

const VotedBox2 = styled(VotedBox)`

    border: 1px solid rgba(255, 81, 209,0.2);
    color: rgba(255, 81, 209,1);

    background: rgba(255, 81, 209,0.2);

`
