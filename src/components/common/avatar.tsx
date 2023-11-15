import styled from 'styled-components';
import { IUser } from 'type/user.type';
import PublicJs from 'utils/publicJs';
// import DefaultAvatar from 'assets/images/avatar.svg';
import useParseSNS from 'hooks/useParseSNS';
import DefaultAvatar from '../../assets/Imgs/defaultAvatarT.png';
import { useEffect, useState } from 'react';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

export default function Avatar({ user }: { user?: IUser }) {
  const sns = useParseSNS(user?.wallet);
  const [avatar, setAvatar] = useState('');

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

  useEffect(() => {
    if (!user) return;
    getAvatar();
  }, [user]);

  const getAvatar = async () => {
    let avarUrl = await PublicJs.getImage(user?.avatar ?? '');
    setAvatar(avarUrl!);
  };
  return (
    <AvatarStyle>
      <span>{sns || user?.name || PublicJs.AddressToShow(user?.wallet || '')}</span>
      <img src={avatar || DefaultAvatar} alt="" />
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
