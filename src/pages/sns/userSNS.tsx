import styled from 'styled-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { PrimaryOutlinedButton } from 'components/common/button';
import SwitchModal from './switchModal';

export default function UserSNS() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<string>();
  return (
    <Page>
      <BackerNav title={t('SNS.MySNS')} to="/sns/register" mb="0" />
      <Container>
        <ContainerWrapper>
          <CurrentUsed>1111.hhh</CurrentUsed>
          <NameList>
            <li>
              <span>as.seedao</span>
              <PrimaryOutlinedButton onClick={() => setShowModal('sss.seedao')}>
                {t('SNS.Switch')}
              </PrimaryOutlinedButton>
            </li>
          </NameList>
        </ContainerWrapper>
      </Container>
      {showModal && <SwitchModal select={showModal} handleClose={() => setShowModal(undefined)} />}
    </Page>
  );
}

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
  border: 1px solid var(--table-border);
  padding-top: 23px;
  box-sizing: border-box;
`;

const CurrentUsed = styled.div`
  font-size: 14px;
  font-family: Poppins, Poppins;
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
