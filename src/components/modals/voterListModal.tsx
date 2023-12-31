import styled from 'styled-components';
import BasicModal from './basicModal';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface IUserProps {
  name: string;
  avatar: string;
}

const UserBox = ({ name, avatar }: IUserProps) => {
  return (
    <UserBoxStyle>
      <Avatar src={avatar || DefaultAvatar} alt="" />
      <span>{name}</span>
    </UserBoxStyle>
  );
};

interface IProps {
  optionId: number;
  count: number;
  onClose: () => void;
}

export default function VoterListModal({ optionId, count, onClose }: IProps) {
    const { t } = useTranslation();
    
    useEffect(() => {
        // TODO: fetch data
    }, [optionId]);

  return (
    <VotersModal handleClose={onClose}>
      <TopCount>{t('Proposal.TotalVoteCount', { count })}</TopCount>
      <List>
        <li>
          <UserBox name="1111" avatar="" />
          <span>1</span>
        </li>
        <li>
          <UserBox name="1111" avatar="" />
          <span>1</span>
        </li>
      </List>
    </VotersModal>
  );
}

const VotersModal = styled(BasicModal)`
  width: 400px;
  min-height: 300px;
  max-height: 80vh;
  overflow-y: auto;
`;

const List = styled.ul`
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block: 20px;
  }
`;

const UserBoxStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const TopCount = styled.div``;
