import styled from 'styled-components';
import React, { useEffect, useState, useImperativeHandle, useRef, MouseEventHandler } from 'react';

import CommentComponent from './comment';
import { Avatar } from './comment';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import publicJs from 'utils/publicJs';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import QuillEditor from './quillEditor';
import { Sources } from 'quill';
import { UnprivilegedEditor } from 'react-quill';
import useLoadQuill from 'hooks/useLoadQuill';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConfirmModal from 'components/modals/confirmModal';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { deleteCommet, addComment, editCommet } from 'requests/proposalV2';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ICommentDisplay } from 'type/proposalV2.type';
import useToast, { ToastType } from 'hooks/useToast';

interface IProps {
  pinId?: number;
  id: number;
  hideReply?: boolean;
  posts: ICommentDisplay[];
  onNewComment: () => void;
  onEditComment: (idx?: number) => void;
  getNextCommentList: () => void;
  hasMore: boolean;
  onDeleteComment: (cid: number, idx: number) => void;
}
export interface IReplyOutputProps {
  showReply: () => void;
}
const ReplyComponent = React.forwardRef<IReplyOutputProps, IProps>(
  ({ pinId, id, hideReply, posts, onEditComment, onNewComment, getNextCommentList, onDeleteComment, hasMore }, ref) => {
    const { t } = useTranslation();
    const {
      state: { userData, account },
      dispatch,
    } = useAuthContext();
    const pinPost = posts.find((p) => p.metaforo_post_id === pinId);
    const filterPosts = posts.filter((p) => p.metaforo_post_id !== pinId);

    const { checkMetaforoLogin } = useCheckMetaforoLogin();
    const replyRef = useRef<HTMLDivElement>(null);

    const enableQuill = useLoadQuill();
    const { showToast } = useToast();

    const [avatar, setAvatar] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [quillContent, setQuillContent] = useState('');
    const [openReply, setOpenReply] = useState(false);
    const [replyId, setReplyId] = useState<number>();
    const [editId, setEditId] = useState<number>();
    const [toBeDeleteId, setTobeDeletedId] = useState<number>();
    const [currentBindIdx, setCurrentBindIdx] = useState<number>();

    const isCurrentUser = (address?: string) => {
      return account?.toLocaleLowerCase() === address?.toLocaleLowerCase();
    };

    const getAvatar = async () => {
      // @ts-ignore
      let avarUrl = await publicJs.getImage(userData?.data?.avatar ?? '');
      setAvatar(avarUrl!);
    };

    useEffect(() => {
      userData && getAvatar();
    }, [userData]);

    const findReplyData = (reply_pid?: number): ICommentDisplay | undefined => {
      if (!reply_pid) {
        return undefined;
      }
      let d: ICommentDisplay | undefined = undefined;
      posts.forEach((p: ICommentDisplay) => {
        if (p.metaforo_post_id === reply_pid) {
          d = p;
        } else {
          const child = p.children?.find((ip: ICommentDisplay) => ip.metaforo_post_id === reply_pid);
          if (child) {
            d = child;
          }
        }
      });
      return d;
    };

    const handleChange = (value: string, source: Sources, editor: UnprivilegedEditor) => {
      // 如果用户输入的内容为空，则设置 content 也为空（默认是 insert \n ）
      if (editor.getText().trim().length === 0) {
        setReplyContent('');
      } else {
        setReplyContent(JSON.stringify(editor.getContents().ops));
      }
      // @ts-ignore
      setQuillContent(editor.getContents);
    };

    const onFocusToWriteReply = async (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      const canReply = await checkMetaforoLogin();
      canReply && setOpenReply(true);
    };

    const onReply = async (id: number, idx: number) => {
      setReplyId(id);
      setOpenReply(true);
      setCurrentBindIdx(idx);
    };

    const onEdit = (id: number, content: any, idx: number) => {
      setEditId(id);
      setOpenReply(true);
      setQuillContent(content);
      setCurrentBindIdx(idx);
    };

    const onDelete = (id: number, idx: number) => {
      setTobeDeletedId(id);
      setCurrentBindIdx(idx);
    };

    const handleReply = async () => {
      const canReply = await checkMetaforoLogin();
      if (canReply) {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
          if (editId) {
            await editCommet(id, replyContent, editId);
            showToast(t('Msg.ApproveSuccess'), ToastType.Success);
          } else {
            await addComment(id, replyContent, replyId);
            showToast(t('Msg.CommentSuccess'), ToastType.Success);
          }
          setOpenReply(false);
          setReplyId(undefined);
          setEditId(undefined);
          setQuillContent('');
          setReplyContent('');
          setCurrentBindIdx(undefined);
          if (editId || replyId) {
            onEditComment(currentBindIdx);
          } else {
            onNewComment();
          }
        } catch (error: any) {
          logError(`add proposal-${id} comment-${replyId} failed`, error);
          showToast(error?.data?.msg || error?.code || error, ToastType.Danger);
        } finally {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        }
      }
    };

    const handleDeletePost = async () => {
      const canDelete = await checkMetaforoLogin();
      if (canDelete && toBeDeleteId) {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        deleteCommet(id, toBeDeleteId)
          .then(() => {
            setTobeDeletedId(undefined);
            setCurrentBindIdx(undefined);
            onDeleteComment(toBeDeleteId, currentBindIdx!);
            showToast(t('Msg.ApproveSuccess'), ToastType.Success);
          })
          .catch((error) => {
            logError(`delete proposal-${id} comment-${toBeDeleteId} failed`, error);
            showToast(error?.data?.msg || error?.code || error, ToastType.Danger);
          })
          .finally(() => {
            dispatch({ type: AppActionType.SET_LOADING, payload: false });
          });
      }
    };

    useImperativeHandle(ref, () => ({
      showReply: () => {
        setOpenReply(true);
      },
    }));

    const findPinPostChildrenParent = (id: number) => {
      const data = findReplyData(id);
      if (data) {
        if (data.metaforo_post_id === pinId) {
          return { ...data, userName: t('city-hall.Cityhall') };
        }
      }
      return data;
    };

    useEffect(() => {
      const checkFocus = (e: MouseEvent) => {
        console.log(openReply, !(replyRef.current && replyRef.current.contains(e.target as Node)));
        if (!replyContent && openReply && !(replyRef.current && replyRef.current.contains(e.target as Node))) {
          setOpenReply(false);
          if (editId) {
            setEditId(undefined);
          }
          if (replyId) {
            setReplyId(undefined);
          }
        }
      };
      document.addEventListener('click', checkFocus);
      return () => {
        document.removeEventListener('click', checkFocus);
      };
    });

    const showList = () =>
      filterPosts.map((p) => (
        <CommentComponent
          data={p}
          key={p.metaforo_post_id}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          hideReply={hideReply}
          isCurrentUser={isCurrentUser(p.wallet)}
          isSpecial={p.is_rejected}
        >
          {p.children?.map((ip: ICommentDisplay) => (
            <CommentComponent
              data={ip}
              isChild={true}
              key={ip.metaforo_post_id}
              parentData={findReplyData(ip.reply_metaforo_post_id)}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              hideReply={hideReply}
              isCurrentUser={isCurrentUser(ip?.wallet)}
              hideVersion
            />
          ))}
        </CommentComponent>
      ));

    return (
      <ReplyComponentStyle>
        {!!pinPost && (
          <CommentComponent
            data={pinPost}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            hideReply={hideReply}
            isCurrentUser={false}
            isSpecial
          >
            {pinPost.children?.map((ip: any) => (
              <CommentComponent
                data={ip}
                isChild={true}
                key={ip.metaforo_post_id}
                parentData={findPinPostChildrenParent(ip.reply_metaforo_post_id)}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                hideReply={hideReply}
                isCurrentUser={isCurrentUser(ip?.wallet)}
                hideVersion
              />
            ))}
          </CommentComponent>
        )}
        {posts.length === 0 && <NoComments>{t('Proposal.EmptyComment')}</NoComments>}
        {posts.length < 10 && posts.length > 0 && showList()}
        {posts.length >= 10 && (
          <InfiniteScroll
            scrollableTarget="scrollableDiv"
            dataLength={posts.length}
            next={getNextCommentList}
            hasMore={hasMore}
            loader={<></>}
          >
            {showList()}
          </InfiniteScroll>
        )}
        {!hideReply && (
          <ReplyArea style={{ position: 'sticky' }} ref={replyRef}>
            <AvatarBox src={avatar || DefaultAvatar} alt="" />
            {enableQuill && (
              <InputReply>
                {openReply ? (
                  <QuillEditor
                    toolbarWidgets={
                      <SubmitCommentButton onClick={handleReply}>
                        {replyId ? t('Proposal.Reply') : t('Proposal.Send')}
                      </SubmitCommentButton>
                    }
                    widgetKey="999"
                    onChange={handleChange}
                    value={quillContent}
                  />
                ) : (
                  <NormalInput placeholder={t('Proposal.WriteReplyHint')} onClick={onFocusToWriteReply} />
                )}
              </InputReply>
            )}
          </ReplyArea>
        )}
        {toBeDeleteId && (
          <ConfirmModal
            msg={t('Proposal.ConfirmDeleteComment')}
            onClose={() => {
              setTobeDeletedId(undefined);
              setCurrentBindIdx(undefined);
            }}
            onConfirm={handleDeletePost}
          />
        )}
      </ReplyComponentStyle>
    );
  },
);

export default ReplyComponent;

const ReplyComponentStyle = styled.div``;

const ReplyArea = styled.div`
  position: sticky;
  bottom: 0;
  background-color: var(--bs-box-background);
  //box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
`;

const AvatarBox = styled(Avatar)`
  margin-right: 0;
`;

const InputReply = styled.div`
  flex: 1;
`;

const SubmitCommentButton = styled(Button)`
  height: 30px;
  line-height: 16px;
`;

const NormalInput = styled.input`
  width: 100%;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  outline: none;
  height: 40px;
  line-height: 40px;
  padding-inline: 16px;
`;

const NoComments = styled.div`
  text-align: left;
  height: 58px;
  line-height: 58px;
  letter-spacing: 0.07px;
  margin-bottom: 32px;
`;
