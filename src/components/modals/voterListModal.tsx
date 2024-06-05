import styled from 'styled-components';
import BasicModal from './basicModal';
import DefaultAvatar from 'assets/Imgs/defaultAvatarT.png';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getVotersOfOption, VoterType } from 'requests/proposalV2';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import publicJs from 'utils/publicJs';
import useQuerySNS from 'hooks/useQuerySNS';

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
  const {
    dispatch,
    state: { snsMap },
  } = useAuthContext();
  const [page, setPage] = useState(1);
  const [list, setList] = useState<VoterType[]>([]);

  const hasMore = list.length < 20;
  const { showToast } = useToast();
  const { getMultiSNS } = useQuerySNS();

  const getList = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    getVotersOfOption(optionId, page)
      .then((res) => {
        setList([...list, ...res.data]);
        setPage((p) => p + 1);
        getMultiSNS(Array.from(new Set(res.data.map((item) => item.wallet))));
      })
      .catch((err: any) => {
        showToast(err, ToastType.Danger);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  useEffect(() => {
    getList();
  }, [optionId]);

  const formatSNS = (wallet: string) => {
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  return (
    <VotersModal handleClose={onClose}>
      <TopCount>{t('Proposal.TotalVoteCount', { count })}</TopCount>
      <List id="voter-modal">
        <InfiniteScroll
          scrollableTarget="voter-modal"
          dataLength={list.length}
          next={getList}
          hasMore={hasMore}
          loader={<></>}
        >
          {list.map((item, index) => (
            <li key={index}>
              <UserBox name={formatSNS(item.wallet?.toLocaleLowerCase())} avatar={item.os_avatar} />
              <span>{item.weight}</span>
            </li>
          ))}
        </InfiniteScroll>
      </List>
    </VotersModal>
  );
}

const VotersModal = styled(BasicModal)`
  width: 540px;
  color: var(--bs-body-color_active);
`;

const List = styled.ul`
  height: 300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block: 24px;
  }
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
`;

const UserBoxStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

const TopCount = styled.div`
  padding-bottom: 8px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  border-bottom: 1px solid var(--bs-border-color);
`;
