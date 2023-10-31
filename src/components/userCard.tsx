import React from 'react';
import { IUser } from 'type/user.type';
// import Image from 'next/image';
import CopyBox from 'components/copy';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import PublicJs from 'utils/publicJs';
import styled from 'styled-components';
// import { useWeb3React } from '@web3-react/core';
import TwitterIcon from 'assets/Imgs/profile/Twitter.svg';
import DiscordIcon from 'assets/Imgs/profile/discord.svg';
import EmailIcon from 'assets/Imgs/profile/message.svg';
import { Col, Form } from 'react-bootstrap';
import { useAuthContext } from '../providers/authProvider';
import CopyIconSVG from 'components/svgs/copy';
import MultiClamp from 'react-multi-clamp';

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
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <span className="wallet">{PublicJs.AddressToShow(user.wallet || '')}</span>
              <CopyBox text={user.wallet || ''} dir="left">
                <CopyIconSVG />
              </CopyBox>
            </div>
          </div>
          {showEdit && account?.toLowerCase() !== user.wallet?.toLowerCase() && (
            <div
              className={formatActive && formatActive(user.wallet || '') ? 'topRht active' : 'topRht'}
              onClick={() => onSelectUser && onSelectUser(user)}
            >
              <Form.Check
                checked={formatActive && formatActive(user.wallet || '')}
                onChange={() => onSelectUser && onSelectUser(user)}
              />
            </div>
          )}
        </div>
        <BioBox>
          <MultiClamp
            clamp={2}
            splitByWords={false}
            ellipsis={
              <span>
                <strong>...</strong>
              </span>
            }
          >
            {user.bio}
          </MultiClamp>
        </BioBox>
        <LinkBox>
          {user.twitter_profile && (
            <a href={user.twitter_profile} target="_blank" rel="noreferrer">
              <img src={TwitterIcon} alt="" className="icon" />
            </a>
          )}
          {/*{user.discord_profile && (*/}
          {/*  <CopyBox text={user.discord_profile || ''} dir="right">*/}
          {/*    <img src={DiscordIcon} alt="" className="icon" />*/}
          {/*  </CopyBox>*/}
          {/*)}*/}
          {user.email && (
            <CopyBox text={user.email || ''}>
              <img src={EmailIcon} alt="" className="icon" />
            </CopyBox>
          )}
        </LinkBox>
      </div>
    </UserCardBox>
  );
}

const LinkBox = styled.div`
  margin-top: 10px;
  img {
    margin-right: 16px !important;
  }
  .copy-content {
    display: inline-block;
  }
`;
const UserCardBox = styled(Col)`
  margin-bottom: 40px;
  .boxAll {
    background-color: var(--bs-background);
    border: 1px solid var(--bs-border-color);
    padding: 24px;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    .svg-stroke {
      stroke: var(--bs-body-color_active) !important;
    }
  }

  .fst {
    display: flex;
    align-items: center;
    position: relative;
  }
  .name {
    color: var(--bs-body-color);
    font-size: 12px;
    word-break: break-all;
  }
  .wallet {
    font-family: Poppins-Medium, Poppins;
  }
  img.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .topRht {
    position: absolute;
    right: -8px;
    top: -8px;
  }
`;

const BioBox = styled.div`
  font-size: 12px;
  color: var(--bs-body-color);
  line-height: 18px;
  margin-top: 12px;
  height: 38px;
`;
