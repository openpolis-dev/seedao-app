import styled from 'styled-components';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import { handleContent } from './parseContent';
import { useEffect, useState } from 'react';
import { UserTitleType } from 'type/proposal.type';
import { PlainButton } from 'components/common/button';
import MoreSelectAction from './moreSelectAction';
import { useTranslation } from 'react-i18next';
import { formatMsgTime } from 'utils/time';

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
  onReply: (id: number) => void;
  onEdit: (id: number, content: any) => void;
  onDelete: (id: number) => void;
  hideReply?: boolean;
  isCurrentUser?: boolean;
}

interface IUserProps {
  name: string;
  avatar: string;
  user_title?: UserTitleType;
}

const UserBox = ({ name, avatar, user_title }: IUserProps) => {
  return (
    <UserBoxStyle>
      <Avatar src={avatar || DefaultAvatar} alt="" />
      <span>{name}</span>
      {user_title && user_title.name && <UserTag bg={user_title.background}>{user_title?.name}</UserTag>}
    </UserBoxStyle>
  );
};

export default function CommentComponent({
  data,
  children,
  isChild,
  parentData,
  onReply,
  onEdit,
  onDelete,
  hideReply,
  isCurrentUser,
}: IProps) {
  const { t } = useTranslation();
  const content = useParseContent(data?.content);

  const handleReply = () => {
    onReply(data.id);
  };

  const handleClickMoreAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit(data.id, { ops: JSON.parse(data.content) });
        break;
      case 'delete':
        onDelete(data.id);
        break;
    }
  };

  return (
    <CommentStyle padding={isChild ? '30px' : '0'}>
      {/* {parentData && <ReplyComment data={parentData} />} */}
      <CommentMain>
        {/* <Avatar src={data.user.photo_url || DefaultAvatar} alt="" /> */}
        <RightBox>
          <RelationUserLine>
            <UserBox name={data.user.username} avatar={data.user.photo_url} user_title={data.user_title} />
            {parentData && (
              <>
                <span>{'==>'}</span>
                <UserBox
                  name={parentData.user.username}
                  avatar={parentData.user.photo_url}
                  user_title={parentData.user_title}
                />
              </>
            )}
            <span>{formatMsgTime(data.created_at, t)}</span>
            <VersionTag>a</VersionTag>
            {!hideReply && (
              <>
                <PlainButton onClick={handleReply}>{t('Proposal.Reply')}</PlainButton>
                {isCurrentUser && (
                  <MoreSelectAction
                    options={[
                      { label: t('Proposal.Edit'), value: 'edit' },
                      { label: t('Proposal.Delete'), value: 'edit' },
                    ]}
                    handleClickAction={handleClickMoreAction}
                  />
                )}
              </>
            )}
          </RelationUserLine>
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
      <UserBox name={data.user.username} avatar={data.user.photo_url} user_title={data.user_title} />
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

const UserBoxStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Avatar = styled.img`
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
`;

const ReplyCommentStyle = styled.div`
  padding: 20px;
  border: 1px solid var(--bs-border-color);
  margin-left: 58px;
`;

const RelationUserLine = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const VersionTag = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--bs-border-color);
  text-align: center;
  line-height: 18px;
`;
