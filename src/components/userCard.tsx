import React from 'react';
import { IUser } from 'type/user.type';
import Image from 'next/image';
import CopyBox from 'components/copy';
import { DefaultAvatar } from 'utils/constant';
import PublicJs from 'utils/publicJs';
import { EvaIcon } from '@paljs/ui/Icon';
import styled from 'styled-components';

interface IUserProps {
  user: IUser;
  showEdit: boolean;
  onSelectUser?: (user: IUser) => void;
  formatActive?: (wallet: string) => boolean;
}

export default function UserCard({ user, showEdit, onSelectUser, formatActive }: IUserProps) {
  return (
    <UserCardBox>
      <div className="fst">
        <Image className="avatar" src={user.avatar || DefaultAvatar} alt="" width="40px" height="40px" />
        <div>
          <div>{user.name}</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span>{PublicJs.AddressToShow(user.wallet || '')}</span>
            <CopyBox text={user.wallet || ''}>
              <EvaIcon name="clipboard-outline" options={{ width: '18px', height: '18px' }} />
            </CopyBox>
          </div>
        </div>
        {showEdit && (
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
            <Image src="/images/twitterNor.svg" alt="" className="icon" width="20px" height="20px" />
          </a>
        )}
        {user.discord_profile && (
          <a href={user.discord_profile} target="_blank" rel="noreferrer">
            <Image src="/images/discordNor.svg" alt="" className="icon" width="20px" height="20px" />
          </a>
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
`;
const UserCardBox = styled.li`
  width: 23%;
  margin-right: 2%;
  border: 1px solid #f1f1f1;
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background: #008800;
  color: #fff;
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
    width: 50px;
    height: 50px;
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
