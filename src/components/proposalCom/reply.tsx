import styled from 'styled-components';
import { useEffect, useState } from 'react';
import POSTS_DATA from './posts';

import CommetComponent from './comment';
import { Avatar } from './comment';
import { useAuthContext } from 'providers/authProvider';
import publicJs from 'utils/publicJs';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import QuillEditor from './quillEditor';
import { Sources } from 'quill';
import { UnprivilegedEditor } from 'react-quill';
import useLoadQuill from 'hooks/useLoadQuill';

export default function ReplyComponent() {
  const {
    state: { userData },
  } = useAuthContext();
  const enableQuill = useLoadQuill();

  const [avatar, setAvatar] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [quillContent, setQuillContent] = useState('');

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
    POSTS_DATA.forEach((p: any) => {
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
  return (
    <ReplyComponentStyle>
      {POSTS_DATA.map((p) => (
        <CommetComponent data={p} key={p.id}>
          {p.children.posts.map((ip) => (
            <CommetComponent data={ip} isChild={true} key={ip.id} parentData={findReplyData(ip.reply_pid)} />
          ))}
        </CommetComponent>
      ))}
      <ReplyArea>
        <Avatar src={avatar || DefaultAvatar} alt="" />
        {enableQuill && (
          <div>
            <QuillEditor widgetKey="999" onChange={handleChange} value={quillContent} />
          </div>
        )}
      </ReplyArea>
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
`;
