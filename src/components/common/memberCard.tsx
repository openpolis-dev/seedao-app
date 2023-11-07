import styled from 'styled-components';
import { IUser, UserRole } from 'type/user.type';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import { useTranslation } from 'react-i18next';
import PublicJs from 'utils/publicJs';

interface IProps {
  user: IUser;
  sns: string;
  role: UserRole;
}

export default function MemberCard({ user, sns, role }: IProps) {
  const { t } = useTranslation();
  return (
    <InnerBox>
      <ImgBox>
        <img className="avatar" src={user.avatar || DefaultAvatar} alt="" />
      </ImgBox>
      <div>
        <div className="snsBox">{sns || PublicJs.AddressToShow(user.wallet || '')}</div>
        {UserRole.Admin === role && <RoleTag>{t('Project.Moderator')}</RoleTag>}
      </div>
    </InnerBox>
  );
}

const InnerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 26px;
  position: relative;
  .snsBox {
    color: var(--bs-body-color_active);
    font-size: 14px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 18px;
    word-break: break-all;
  }
`;

const ImgBox = styled.div`
  margin-right: 12px;
  img {
    width: 44px;
    height: 44px;
    border-radius: 44px;
  }
`;

const RoleTag = styled.span`
  margin-top: 8px;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  background: #2dc45e;
  border-radius: 6px;
  padding: 0 8px;
  color: #000;
  font-size: 12px;
`;
