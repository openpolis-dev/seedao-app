import styled from 'styled-components';
import React, { useEffect, useState } from 'react';

import CommetComponent from './comment';
import { Avatar } from './comment';
import { useAuthContext } from 'providers/authProvider';
import publicJs from 'utils/publicJs';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import QuillEditor from './quillEditor';
import { Sources } from 'quill';
import { UnprivilegedEditor } from 'react-quill';
import useLoadQuill from 'hooks/useLoadQuill';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import NoItem from 'components/noItem';

interface IProps {
  hideReply?: boolean;
  posts: any[];
}

export default function ReplyComponent({ hideReply, posts }: IProps) {
  const { t } = useTranslation();
  const {
    state: { userData },
  } = useAuthContext();
  const enableQuill = useLoadQuill();

  const [avatar, setAvatar] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [quillContent, setQuillContent] = useState('');
  const [openReply, setOpenReply] = useState(false);
  const [replyId, setReplyId] = useState<number>();

  const getAvatar = async () => {
    let avarUrl = await publicJs.getImage(userData?.avatar ?? '');
    setAvatar(avarUrl!);
  };

  useEffect(() => {
    userData && getAvatar();
  }, [userData]);

  const findReplyData = (reply_pid?: number) => {
    if (!reply_pid) {
      return null;
    }
    let d: any;
    posts.forEach((p: any) => {
      if (p.id === reply_pid) {
        d = p;
      } else {
        const child = p.children?.posts.find((ip: any) => ip.id === reply_pid);
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

  const onFocusToWriteReply = () => {
    // TODO: check login
    setOpenReply(true);
  };

  const onReply = (id: number) => {
    setReplyId(id);
    setOpenReply(true);
  };

  const onEdit = (id: number, content: string) => {
    setOpenReply(true);
    setQuillContent(content);
  };

  const handleReply = () => {
    // TODO
  };

  return (
    <ReplyComponentStyle>
      {posts.length === 0 && <NoItem text={t('Proposal.EmptyComment')}></NoItem>}
      {posts.map((p) => (
        <CommetComponent data={p} key={p.id} onReply={onReply} onEdit={onEdit} hideReply>
          {p.children.posts.map((ip: any) => (
            <CommetComponent
              data={ip}
              isChild={true}
              key={ip.id}
              parentData={findReplyData(ip.reply_pid)}
              onReply={onReply}
              onEdit={onEdit}
              hideReply
            />
          ))}
        </CommetComponent>
      ))}
      {!hideReply && (
        <ReplyArea style={{ position: openReply ? 'sticky' : 'static' }}>
          <Avatar src={avatar || DefaultAvatar} alt="" />
          {enableQuill && (
            <InputReply>
              {openReply ? (
                <QuillEditor
                  toolbarWidgets={<SubmitCommentButton onClick={handleReply}>{t('Proposal.Send')}</SubmitCommentButton>}
                  widgetKey="999"
                  onChange={handleChange}
                  value={quillContent}
                />
              ) : (
                <NormalInput placeholder="write a reply" onFocus={onFocusToWriteReply} />
              )}
            </InputReply>
          )}
        </ReplyArea>
      )}
    </ReplyComponentStyle>
  );
}

const ReplyComponentStyle = styled.div``;

const ReplyArea = styled.div`
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: #fff;
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
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
  border-radius: 16px;
  outline: none;
  height: 30px;
  padding-inline: 16px;
`;
