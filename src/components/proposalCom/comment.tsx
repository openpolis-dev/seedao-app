import styled from 'styled-components';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import { handleContent } from './parseContent';
import { useEffect, useState } from 'react';

const useParseContent = (data: string) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const parse = async () => {
      const _content = await handleContent(data);
      setContent(_content);
    };
    parse();
  }, [data]);
  return content;
};

interface IProps {
  data: any;
  parentData?: any;
  children?: React.ReactNode;
  isChild?: boolean;
}

export default function CommentComponent({ data, children, isChild, parentData }: IProps) {
  const content = useParseContent(data?.content);

  return (
    <CommentStyle padding={isChild ? '30px' : '0'}>
      {parentData && <ReplyComment data={parentData} />}
      <CommentMain>
        <Avatar src={data.user.photo_url || DefaultAvatar} alt="" />
        <RightBox>
          <div>
            <span>{data.user.username}</span>
            {data.user_title && <UserTag bg={data.user_title.background}>{data.user_title?.name}</UserTag>}
            <span>x hour ago</span>
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
        </RightBox>
      </CommentMain>
      {children}
    </CommentStyle>
  );
}

const ReplyComment = ({ data }: { data: any }) => {
  const content = useParseContent(data?.content);

  return (
    <ReplyCommentStyle>
      <div>
        <Avatar src={data.user.photo_url || DefaultAvatar} alt="" />
        <span>{data.user.username}</span>
        {data.user_title && <UserTag bg={data.user_title.background}>{data.user_title?.name}</UserTag>}
        <span>x hour ago</span>
      </div>

      <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </ReplyCommentStyle>
  );
};

const CommentStyle = styled.div<{ padding: string }>`
  padding-left: ${(props) => props.padding};
  margin-bottom: 20px;
`;

const CommentMain = styled.div`
  display: flex;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const RightBox = styled.div`
  background-color: var(--bs-box--background);
  border-radius: 16px;
  padding: 16px;
`;

const UserTag = styled.span<{ bg: string }>`
  padding-inline: 8px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  color: #000;
  background-color: ${(props) => props.bg};
  border-radius: 6px;
  margin-left: 8px;
`;

const ReplyCommentStyle = styled.div`
  padding: 20px;
  border: 1px solid var(--bs-border-color);
  margin-left: 58px;
`;
