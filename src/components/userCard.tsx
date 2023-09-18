import React from 'react';
import { IUser } from 'type/user.type';
// import Image from 'next/image';
import CopyBox from 'components/copy';
import { DefaultAvatar } from 'utils/constant';
import PublicJs from 'utils/publicJs';
import copyIcon from 'assets/images/copy.svg';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import TwitterIcon from 'assets/images/twitterNor.svg';
import DiscordIcon from 'assets/images/discordNor.svg';
import EmailIcon from 'assets/images/email.svg';

interface IUserProps {
  user: IUser;
  showEdit: boolean;
  onSelectUser?: (user: IUser) => void;
  formatActive?: (wallet: string) => boolean;
}

export default function UserCard({ user, showEdit, onSelectUser, formatActive }: IUserProps) {
  const { account } = useWeb3React();
  return (
    <UserCardBox>
      <div className="fst">
        {user.avatar ? (
          <img className="avatar" src={user.avatar} alt="" />
        ) : (
          <img className="avatar" src={DefaultAvatar} alt="" width="40px" height="40px" />
        )}

        <div>
          <div>{user.name}</div>
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
const UserCardBox = styled.li`
  width: 23%;
  margin-right: 2%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  padding: 20px;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .fst {
    display: flex;
    align-items: center;
    position: relative;
    gap: 10px;
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
