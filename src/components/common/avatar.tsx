import styled from 'styled-components';
import { IUser } from 'type/user.type';
import PublicJs from 'utils/publicJs';

export default function Avatar({ user }: { user?: IUser }) {
  return (
    <AvatarStyle>
      <img src={user?.avatar} alt="" />
      <span>{user?.name || PublicJs.AddressToShow(user?.wallet || '')}</span>
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
