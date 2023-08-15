import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import useTranslation from 'hooks/useTranslation';
import { useRouter } from 'next/router';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { DefaultAvatar, SEEDAO_USER_DATA, SELECT_WALLET } from 'utils/constant';

type DropdownItemType = {
  title: string;
  link?: string;
  value: string;
};

interface IDropdownProps {
  activePath: string;
  list: DropdownItemType[];
  onSelect: (d: DropdownItemType) => void;
}

const Dropdown = ({ activePath, list, onSelect }: IDropdownProps) => {
  return (
    <DropdownBox className="dropdown">
      {list.map((item) => (
        <DropdownItem
          key={item.value}
          onClick={() => onSelect(item)}
          className={activePath === item.link ? 'active' : ''}
        >
          {item.title}
        </DropdownItem>
      ))}
    </DropdownBox>
  );
};

interface IUserProps {
  user: {
    avatar: string;
    name: string;
  };
}

const UserDropdown = ({ user }: IUserProps) => {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const router = useRouter();
  const { pathname } = router;

  const handleSelectMenu = (m: DropdownItemType) => {
    if (m.link) {
      router.push(m.link);
    } else if (m.value === 'logout') {
      dispatch({ type: AppActionType.CLEAR_AUTH, payload: undefined });
      localStorage.removeItem(SEEDAO_USER_DATA);
      localStorage.removeItem(SELECT_WALLET);
      dispatch({ type: AppActionType.SET_LOGIN_DATA, payload: null });
      dispatch({ type: AppActionType.SET_AUTHORIZER, payload: null });
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: null });
      router.push('/');
    }
  };
  return (
    <User>
      <div>
        {user.avatar ? (
          <img src={user.avatar} alt="" className="avatar" />
        ) : (
          <Image src={DefaultAvatar} alt="" width="40px" height="40px" />
        )}
      </div>
      <span>{user.name}</span>
      <Dropdown
        list={[
          { title: t('My.MyProfile'), link: '/user/profile', value: 'profile' },
          { title: t('My.MyAccount'), link: '/user/vault', value: 'vault' },
          { title: t('My.Exit'), value: 'logout' },
        ]}
        onSelect={handleSelectMenu}
        activePath={pathname}
      />
    </User>
  );
};

export default UserDropdown;

const DropdownBox = styled.ul`
  min-width: 10rem;
  max-width: 15rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
  border-radius: 0.25rem;
  position: absolute;
  right: -10px;
  top: 45px;
  background-color: #fff;
`;

const DropdownItem = styled.li`
  ${({ theme }) => css`
    border-top: 1px solid #edf1f7;
    text-align: center;
    line-height: 1.25rem;
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
    cursor: pointer;
    &:hover {
      color: ${theme.colorPrimary400};
    }
    &:first-child {
      border-top: none;
    }
    &.active {
      color: ${theme.colorPrimary500};
    }
    &.active:hover {
      color: ${theme.colorPrimary400};
    }
  `}
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #edf1f7;
  }
  .dropdown {
    display: none;
  }
  &:hover {
    .dropdown {
      display: block;
    }
  }
`;
