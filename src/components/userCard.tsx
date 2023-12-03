import React, { useMemo } from 'react';
import { IUser } from 'type/user.type';
// import Image from 'next/image';
import CopyBox from 'components/copy';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import PublicJs from 'utils/publicJs';
import styled from 'styled-components';
// import { useWeb3React } from '@web3-react/core';
import { Col, Form } from 'react-bootstrap';
import { useAuthContext } from '../providers/authProvider';
import CopyIconSVG from 'components/svgs/copy';
import { useTranslation } from 'react-i18next';
import SocialIconBox from 'components/common/socialIcon';
import ProfileComponent from '../profile-components/profile';

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
    state: { account, theme },
  } = useAuthContext();

  const { t } = useTranslation();

  const borderStyle = useMemo(() => {
    return theme ? '1px solid #29282F' : 'unset';
  }, [theme]);

  return (
    <UserCardBox sm={12} md={6} lg={4} xl={3} border={borderStyle}>
      <div className="boxAll">
        <div className="modalBox">
          <ProfileComponent userData={user} theme={theme} />
        </div>
        <div className="fst">
          <img className="avatar" src={user.avatar || DefaultAvatar} alt="" />
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <span className="wallet">{sns || PublicJs.AddressToShow(user.wallet || '')}</span>
              <CopyBox text={user.wallet || ''} dir="left">
                <CopyIconSVG />
              </CopyBox>
            </div>
            <div className="name">{user.name || t('My.DefaultName')}</div>
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
        <BioBox>{user.bio || t('My.DefaultBio')}</BioBox>
        <SocialIconBox user={user} />
      </div>
    </UserCardBox>
  );
}

const UserCardBox = styled(Col)<{ border: string }>`
  margin-bottom: 24px;
  .boxAll {
    position: relative;
    background: var(--bs-box--background);
    border: ${(props) => props.border};
    padding: 14px;
    border-radius: 8px;
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
    height: 100%;
    &:hover {
      background: var(--bs-menu-hover);
      .modalBox {
        display: block;
      }
    }
    .svg-stroke {
      stroke: var(--bs-body-color_active) !important;
    }
    .modalBox {
      position: absolute;
      left: 50%;
      top: -120%;
      z-index: 9999;
      display: none;
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
    object-fit: cover;
    object-position: center;
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
  color: var(--bs-body-color_active);
  line-height: 18px;
  margin-top: 12px;
  margin-bottom: 10px;
  height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
