import React from 'react';
import { IUser } from 'type/user.type';
// import Image from 'next/image';
import CopyBox from 'components/copy';
import { DefaultAvatar } from 'utils/constant';
import PublicJs from 'utils/publicJs';
import copyIcon from 'assets/images/copy.svg';
import styled from 'styled-components';
// import { useWeb3React } from '@web3-react/core';
import TwitterIcon from 'assets/images/twitterNor.svg';
import DiscordIcon from 'assets/images/discordNor.svg';
import EmailIcon from 'assets/images/email.svg';
import { Col } from 'react-bootstrap';
import { useAuthContext } from '../providers/authProvider';

interface IUserProps {
  user: IUser;
  showEdit: boolean;
  sns?: string;
  onSelectUser?: (user: IUser) => void;
  formatActive?: (wallet: string) => boolean;
}

export default function UserCard({ user, showEdit, onSelectUser, formatActive, sns }: IUserProps) {
  // const { account } = useWeb3React();

  const {
    state: { account },
  } = useAuthContext();

  return (
    <UserCardBox sm={12} md={6} lg={4} xl={3}>
      <div className="boxAll">
        <div className="fst">
          {user.avatar ? (
            <img className="avatar" src={user.avatar} alt="" />
          ) : (
            <img className="avatar" src={DefaultAvatar} alt="" width="40px" height="40px" />
          )}

          <div>
            <div className="name">{sns || user.name}</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span>{PublicJs.AddressToShow(user.wallet || '')}</span>
              <CopyBox text={user.wallet || ''} dir="left">
                <img src={copyIcon} alt="" style={{ position: 'relative', top: '-2px' }} />
              </CopyBox>
            </div>
          </div>
          {showEdit && account?.toLowerCase() !== user.wallet?.toLowerCase() && (
            <div
              className={formatActive && formatActive(user.wallet || '') ? 'topRht active' : 'topRht'}
              onClick={() => onSelectUser && onSelectUser(user)}
            >
              <div className="inner" />
            </div>
          )}
        </div>
        <LinkBox>
          {user.twitter_profile && (
            <a href={user.twitter_profile} target="_blank" rel="noreferrer">
              <img src={TwitterIcon} alt="" className="icon" width="20px" height="20px" />
            </a>
          )}
          {user.discord_profile && (
            <CopyBox text={user.discord_profile || ''} dir="right">
              <img src={DiscordIcon} alt="" className="icon" width="20px" height="20px" />
            </CopyBox>
          )}
          {user.email && (
            <CopyBox text={user.email || ''}>
              <img src={EmailIcon} alt="" className="icon" width="20px" height="20px" />
            </CopyBox>
          )}
        </LinkBox>
      </div>
    </UserCardBox>
  );
}

const LinkBox = styled.div`
  margin-top: 20px;
  img {
    width: 20px;
    height: 20px;
    margin-inline: 5px !important;
  }
  .copy-content {
    display: inline-block;
  }
`;
const UserCardBox = styled(Col)`
  //margin-right: 2%;

  margin-bottom: 40px;

  .boxAll {
    padding: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
  }

  .fst {
    display: flex;
    align-items: center;
    position: relative;
  }
  .name {
    font-size: 14px;
    word-break: break-all;
  }
  img.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #edf1f7;
    margin-right: 20px;
  }
  .topRht {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    background: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 40px;
    cursor: pointer;
    //.inner{
    //  display:none;
    //  }
  }
  .active {
    border: 1px solid #a16eff;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
      width: 10px;
      height: 10px;
      background: #a16eff;
      border-radius: 20px;
    }
  }
`;
