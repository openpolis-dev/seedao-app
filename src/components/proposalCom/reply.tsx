import styled from 'styled-components';
import React, { useEffect, useState, useImperativeHandle } from 'react';

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
import NoItem from 'components/noItem';
import ConfirmModal from 'components/modals/confirmModal';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { deleteCommet, addComment, editCommet } from 'requests/proposalV2';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ICommentDisplay } from 'type/proposalV2.type';

interface IProps {
  pinId?: number;
  id: number;
  hideReply?: boolean;
  posts: ICommentDisplay[];
  onNewComment: () => void;
  onEditComment: (idx?: number) => void;
  getNextCommentList: () => void;
  hasMore: boolean;
}
export interface IReplyOutputProps {
  showReply: () => void;
}
const ReplyComponent = React.forwardRef<IReplyOutputProps, IProps>(
  ({ pinId, id, hideReply, posts, onEditComment, onNewComment, getNextCommentList, hasMore }, ref) => {
    const { t } = useTranslation();
    const {
      state: { userData, account },
      dispatch,
    } = useAuthContext();
    const pinPost = posts.find((p) => p.metaforo_post_id === pinId);
    const filterPosts = posts.filter((p) => p.metaforo_post_id !== pinId);

    const { checkMetaforoLogin } = useCheckMetaforoLogin();

    const enableQuill = useLoadQuill();

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

    const onFocusToWriteReply = async () => {
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
          } else {
            await addComment(id, replyContent, replyId);
          }
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
        } catch (error) {
          logError(`add proposal-${id} comment-${replyId} failed`, error);
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
            // onNewComment();
            // TODO
          })
          .catch((error) => {
            logError(`delete proposal-${id} comment-${toBeDeleteId} failed`, error);
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
              />
            ))}
          </CommentComponent>
        )}
        {posts.length === 0 && <NoItem text={t('Proposal.EmptyComment')}></NoItem>}
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={posts.length}
          next={getNextCommentList}
          hasMore={hasMore}
          loader={<></>}
        >
          {filterPosts.map((p) => (
            <CommentComponent
              data={p}
              key={p.metaforo_post_id}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              hideReply={hideReply}
              isCurrentUser={isCurrentUser(p.wallet)}
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
                />
              ))}
            </CommentComponent>
          ))}
        </InfiniteScroll>
        {!hideReply && (
          <ReplyArea style={{ position: 'sticky' }}>
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
                  <NormalInput placeholder="write a reply" onClick={onFocusToWriteReply} />
                )}
              </InputReply>
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
          </ReplyArea>
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
`;

const NormalInput = styled.input`
  width: 100%;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  outline: none;
  height: 50px;
  padding-inline: 16px;
`;
