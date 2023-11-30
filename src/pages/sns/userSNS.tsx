import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { PrimaryOutlinedButton } from 'components/common/button';
import SwitchModal from './switchModal';
import sns, { builtin } from '@seedao/sns-js';
import { useAuthContext } from 'providers/authProvider';
import LoadingImg from 'assets/Imgs/loading.png';
import NoItem from 'components/noItem';
import { ethers } from 'ethers';

export default function UserSNS() {
  const { t } = useTranslation();
  const {
    state: { account, sns: userSNS },
  } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<string>();
  const [snsList, setSnsList] = useState<string[]>([]);

  useEffect(() => {
    const getSNSList = () => {
      if (!account) {
        return;
      }
      setLoading(true);
      fetch(`${builtin.INDEXER_HOST}/sns/list_by_wallet/${ethers.utils.getAddress(account)}`)
        .then((res) => res.json())
        .then((res) => {
          setSnsList(res.map((item: any) => item.sns));
        })
        .catch((err) => {
          console.error("Can't get sns list", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getSNSList();
  }, [account]);
  const list = snsList.filter((item) => item !== userSNS);
  const handleCloseModal = (newSNS?: string) => {
    setShowModal(undefined);
  };
  return (
    <Page>
      <BackerNav title={t('SNS.MySNS')} to="/sns/register" mb="0" />
      <Container>
        <ContainerWrapper>
          <CurrentUsed>{userSNS || account}</CurrentUsed>
          {loading ? (
            <Loading />
          ) : !!snsList.length ? (
            <NameList>
              {list.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  <PrimaryOutlinedButton onClick={() => setShowModal(item)}>{t('SNS.Switch')}</PrimaryOutlinedButton>
                </li>
              ))}
            </NameList>
          ) : (
            <NoItem />
          )}
        </ContainerWrapper>
      </Container>
      {showModal && <SwitchModal select={showModal} handleClose={handleCloseModal} />}
    </Page>
  );
}

const Loading = () => {
  return (
    <LoadingStyle>
      <img src={LoadingImg} alt="" />
    </LoadingStyle>
  );
};

const LoadingStyle = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  img {
    user-select: none;
    width: 40px;
    height: 40px;
    animation: rotate 1s infinite linear;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Page = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;

const Container = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContainerWrapper = styled.div`
  background-color: var(--bs-box-background);
  height: 482px;
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  padding-top: 23px;
  box-sizing: border-box;
`;

const CurrentUsed = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--bs-primary);
  line-height: 68px;
  padding-inline: 33px;
  border-bottom: 1px solid var(--table-border);
`;

const NameList = styled.ul`
  height: calc(100% - 89px);
  overflow-y: auto;
  color: var(--bs-body-color_active);
  font-size: 14px;
  li {
    line-height: 68px;
    padding-inline: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--table-border);
  }
`;
