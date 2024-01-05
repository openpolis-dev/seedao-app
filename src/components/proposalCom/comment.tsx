import styled from 'styled-components';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import { handleContent } from './parseContent';
import React, { useEffect, useState } from 'react';
import { UserTitleType } from 'type/proposal.type';
import { PlainButton } from 'components/common/button';
import MoreSelectAction from './moreSelectAction';
import { useTranslation } from 'react-i18next';
import { formatMsgTime } from 'utils/time';
import CommentIcon from '../../assets/Imgs/proposal/commentIcon.png';
import ProfileComponent from '../../profile-components/profile';
import { useAuthContext } from '../../providers/authProvider';
import { ICommentDisplay } from 'type/proposalV2.type';
import publicJs from 'utils/publicJs';
import CityHallImg from 'assets/Imgs/proposal/cityhall.png';

export const DeletedContent = `[{"insert":"Post deleted\\n"}]`;

const formatSNS = (snsMap: Map<string, string>, wallet: string) => {
  const name = snsMap.get(wallet) || wallet;
  return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
};

const useParseContent = (data: string, noNeedParse?: boolean) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const parse = async () => {
      const _content = await handleContent(data);
      setContent(_content);
    };
    !noNeedParse && parse();
  }, [data, noNeedParse]);
  return content;
};

interface IProps {
  data: ICommentDisplay;
  parentData?: any;
  children?: React.ReactNode;
  isChild?: boolean;
  onReply: (id: number, idx: number) => void;
  onEdit: (id: number, content: any, idx: number) => void;
  onDelete: (id: number, idx: number) => void;
  hideReply?: boolean;
  isCurrentUser?: boolean;
  isSpecial?: boolean;
}

interface IUserProps {
  name?: string;
  avatar: string;
  address: string;
  isSpecial: boolean | undefined;
  user_title?: UserTitleType;
}

const UserBox = ({ address, name, avatar, user_title, isSpecial }: IUserProps) => {
  const [showModal, setShowModal] = useState(false);

  const {
    state: { theme },
  } = useAuthContext();
  const handleClose = () => {
    setShowModal(false);
  };

  const handleProfile = () => {
    setShowModal(true);
  };

  return (
    <>
      {showModal && <ProfileComponent address={address} theme={theme} handleClose={handleClose} />}
      <UserBoxStyle onClick={() => handleProfile()}>
        <Avatar src={isSpecial ? CityHallImg : avatar || DefaultAvatar} alt="" />
        <NameBox>{name}</NameBox>
        {user_title && user_title.name && <UserTag bg={user_title.background}>{user_title?.name}</UserTag>}
      </UserBoxStyle>
    </>
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
  isSpecial,
}: IProps) {
  const { t } = useTranslation();
  const {
    state: { snsMap },
  } = useAuthContext();
  const content = useParseContent(data?.deleted ? DeletedContent : data?.content, isSpecial);

  const handleReply = () => {
    onReply(data.metaforo_post_id, data.bindIdx);
  };

  const handleClickMoreAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit(data.metaforo_post_id, { ops: JSON.parse(data.content) }, data.bindIdx);
        break;
      case 'delete':
        onDelete(data.metaforo_post_id, data.bindIdx);
        break;
    }
  };

  return (
    <CommentStyle padding={isChild ? '64px' : '0'}>
      {/* {parentData && <ReplyComment data={parentData} />} */}
      <CommentMain>
        {/* <Avatar src={data.user.photo_url || DefaultAvatar} alt="" /> */}
        <RightBox>
          <RelationUserLine>
            <UserBox
              address={data.wallet?.toLocaleLowerCase()}
              isSpecial={isSpecial}
              name={isSpecial ? t('city-hall.Cityhall') : formatSNS(snsMap, data.wallet?.toLocaleLowerCase())}
              avatar={data.avatar}
            />
            {parentData && (
              <>
                <span>
                  {'@'} {parentData?.userName || formatSNS(snsMap, parentData.wallet?.toLocaleLowerCase())}
                </span>
              </>
            )}
            <TimeBox>{formatMsgTime(data.created_ts * 1000, t)}</TimeBox>
            {data.proposal_arweave_hash && (
              <VersionTag href={`https://arweave.net/tx/${data.proposal_arweave_hash}/data.html`} target="__blank">
                a
              </VersionTag>
            )}
          </RelationUserLine>
          {isSpecial ? (
            <Content>{data.content}</Content>
          ) : (
            <Content className="content" dangerouslySetInnerHTML={{ __html: content }}></Content>
          )}
          {!data.deleted && (
            <OpLine>
              {!hideReply && (
                <FlexReply>
                  <ReplyBtn onClick={handleReply}>
                    <img src={CommentIcon} alt="" />
                    {t('Proposal.Reply')}
                  </ReplyBtn>
                  {isCurrentUser && (
                    <MoreSelectAction
                      options={[
                        { label: t('Proposal.Edit'), value: 'edit' },
                        { label: t('Proposal.Delete'), value: 'delete' },
                      ]}
                      handleClickAction={handleClickMoreAction}
                    />
                  )}
                </FlexReply>
              )}
            </OpLine>
          )}
        </RightBox>
      </CommentMain>
      {children}
    </CommentStyle>
  );
}

const CommentStyle = styled.div<{ padding: string }>`
  padding-left: ${(props) => props.padding};
  margin-bottom: 32px;
  p {
    padding: 0;
    margin: 0;
  }
`;

const CommentMain = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const UserBoxStyle = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  margin-right: 24px;
`;

const RightBox = styled.div``;

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
`;

const VersionTag = styled.a`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #2f8fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2f8fff;
  background: var(--bs-box-background);
  &:hover {
    color: #2f8fff;
  }
`;

const Content = styled.div`
  padding-left: 64px;

  color: var(--bs-body-color_active);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;
const NameBox = styled.div`
  color: var(--bs-body-color_active);
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  line-height: 22px;
`;
const TimeBox = styled.div`
  color: #bbb;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`;

const OpLine = styled.div`
  padding-left: 64px;
  display: flex;
`;
const ReplyBtn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  color: #2f8fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-right: 10px;
  img {
    margin-right: 8px;
  }
`;
const FlexReply = styled.div`
  display: flex;
  align-items: center;
  color: #2f8fff;
`;
