import styled from 'styled-components';
import { IUser, UserRole } from 'type/user.type';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import { useTranslation } from 'react-i18next';
import PublicJs from 'utils/publicJs';
import SocialIconBox from './socialIcon';
import { useMemo } from 'react';
import CopyBox from 'components/copy';
import CopyIconSVG from 'components/svgs/copy';
import { Form } from 'react-bootstrap';
import ProfileComponent from '../../profile-components/profile';
import { useAuthContext } from '../../providers/authProvider';

interface IProps {
  user: IUser;
  sns: string;
  role: UserRole;
  showEdit?: boolean;
  removeText?: string;
  onSelectUser?: (user: IUser) => void;
  showRemoveModal?: (user: IUser, role: UserRole) => void;
}

export default function MemberCard({ user, sns, role, removeText, showRemoveModal, showEdit, onSelectUser }: IProps) {
  const { t } = useTranslation();
  const {
    state: { theme },
  } = useAuthContext();
  const snsDisplay = useMemo(() => {
    return sns || PublicJs.AddressToShow(user.wallet || '', 4);
  }, [sns, user]);

  const handleClockRemove = () => {
    showRemoveModal && showRemoveModal(user, role);
  };
  return (
    <InnerBox>
      {showEdit && (
        <CheckLft>
          <Form.Check type="checkbox" onChange={() => onSelectUser && onSelectUser(user)} />
        </CheckLft>
      )}
      <ImgBox>
        <img className="avatar" src={user.avatar || DefaultAvatar} alt="" />
      </ImgBox>
      <div>
        <div className="sns-box">{snsDisplay}</div>
        {UserRole.Admin === role && <RoleTag>{t('Project.Moderator')}</RoleTag>}
      </div>
      <HoverCard className="hover-card">
        <ProfileComponent userData={user} theme={theme} />
        {/*<HoverCardAvatar>*/}
        {/*  <img src={user.avatar || DefaultAvatar} alt="" />*/}
        {/*</HoverCardAvatar>*/}
        {/*<HoverNameBox>*/}
        {/*  <div className="sns-display">*/}
        {/*    <span className="sns">{snsDisplay}</span>*/}
        {/*    <CopyBox text={user.wallet || ''} dir="left">*/}
        {/*      <CopyIconSVG />*/}
        {/*    </CopyBox>*/}
        {/*  </div>*/}
        {/*  <div className="name">{user.name || t('My.DefaultName')}</div>*/}
        {/*</HoverNameBox>*/}
        {/*<SocialBox>*/}
        {/*  <SocialIconBox user={user} />*/}
        {/*</SocialBox>*/}
        {/*{removeText && <RemoveButton onClick={handleClockRemove}>{removeText}</RemoveButton>}*/}
      </HoverCard>
    </InnerBox>
  );
}

const InnerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 26px;
  position: relative;
  .hover-card {
    display: none;
  }
  &:hover .hover-card {
    display: block;
  }
  .sns-box {
    color: var(--bs-body-color_active);
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    line-height: 18px;
    word-break: break-all;
  }
`;

const ImgBox = styled.div`
  margin-right: 12px;
  position: relative;
  img {
    width: 44px;
    height: 44px;
    object-fit: cover;
    object-position: center;
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

const HoverCard = styled.div`
  position: absolute;
  left: 50%;
  top: -300%;
  z-index: 9999;
  display: none;
  //width: 292px;
  //position: absolute;
  //padding: 32px;
  //background: var(--bs-background);
  //border-radius: 16px 16px 16px 16px;
  //opacity: 1;
  //border: 1px solid var(--option-button-border-color);
  //left: 84px;
  //bottom: -50px;
  //z-index: 9;
`;

const HoverCardAvatar = styled.div`
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
  }
`;

const HoverNameBox = styled.div`
  margin-top: 16px;
  margin-bottom: 4px;
  .sns-display {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sns {
    font-size: 18px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: var(--bs-body-color_active);
    line-height: 23px;
  }
  .nam {
    margin-top: 8px;
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
`;

const SocialBox = styled.div`
  .title {
    font-size: 12px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: var(--bs-body-color);
    margin-bottom: 14px;
  }
`;

const RemoveButton = styled.button`
  width: 100%;
  height: 34px;
  line-height: 34px;
  background: var(--bs-background);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--bs-border-color);
  font-size: 14px;
  font-family: Poppins-Medium, Poppins;
  font-weight: 500;
  color: var(--bs-body-color);
  margin-top: 47px;
  text-align: center;
`;

const CheckLft = styled.div`
  margin-right: 10px;
`;
