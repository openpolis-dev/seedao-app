import styled from 'styled-components';
import { IUser } from 'type/user.type';
import PublicJs from 'utils/publicJs';
// import DefaultAvatar from 'assets/images/avatar.svg';
import useParseSNS from 'hooks/useParseSNS';
import DefaultAvatar from '../../assets/Imgs/defaultAvatarT.png';
import { useEffect } from 'react';
import requests from '../../requests';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

export default function Avatar({ user }: { user?: IUser }) {
  const sns = useParseSNS(user?.wallet);

  const {
    state: { userData },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    const { data } = userData as any;
    if (!data) return;
    data.sns = sns;

    dispatch({ type: AppActionType.SET_USER_DATA, payload: userData });
  }, [sns]);

  return (
    <AvatarStyle>
      <span>{sns || user?.name || PublicJs.AddressToShow(user?.wallet || '')}</span>
      <img src={user?.avatar || DefaultAvatar} alt="" />
    </AvatarStyle>
  );
}

const AvatarStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`;
