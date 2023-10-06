import styled from 'styled-components';
import { IUser } from 'type/user.type';
import PublicJs from 'utils/publicJs';
import DefaultAvatar from 'assets/images/avatar.svg';
import useParseSNS from 'hooks/useParseSNS';

export default function Avatar({ user }: { user?: IUser }) {
  const sns = useParseSNS(user?.wallet);
  return (
    <AvatarStyle>
      <img src={user?.avatar || DefaultAvatar} alt="" />
      <span>{sns || user?.name || PublicJs.AddressToShow(user?.wallet || '')}</span>
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
    border: 1px solid rgb(237, 241, 247);
  }
`;
