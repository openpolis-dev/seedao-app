import styled from 'styled-components';
import BasicModal from 'components/modals/basicModal';
import { Button } from 'react-bootstrap';
import { PrimaryOutlinedButton } from 'components/common/button';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ethers } from 'ethers';
import { builtin } from '@seedao/sns-js';
import ABI from 'assets/abi/snsRegister.json';

interface IProps {
  select: string;
  handleClose: (newSNS?: string) => void;
}

export default function SwitchModal({ select, handleClose }: IProps) {
  const { t } = useTranslation();
  const {
    state: { account, provider },
    dispatch,
  } = useAuthContext();

  const handleSwitch = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const contract = new ethers.Contract(builtin.SEEDAO_REGISTRAR_CONTROLLER_ADDR, ABI, provider.getSigner());
      const tx = await contract.setDefaultAddr(select.replace('.seedao', ''), builtin.PUBLIC_RESOLVER_ADDR);
      await tx.wait();
      handleClose(select);
      dispatch({ type: AppActionType.SET_SNS, payload: select });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  return (
    <SwitchModalStyle handleClose={handleClose}>
      <SelectSNS>{select}</SelectSNS>
      <Content>{account}</Content>
      <Footer>
        <PrimaryOutlinedButton
          onClick={() => handleClose()}
          style={{ width: '110px', height: '40px', lineHeight: '40px' }}
        >
          {t('general.cancel')}
        </PrimaryOutlinedButton>
        <Button variant="primary" onClick={handleSwitch} style={{ width: '110px' }}>
          {t('general.confirm')}
        </Button>
      </Footer>
    </SwitchModalStyle>
  );
}

const SwitchModalStyle = styled(BasicModal)`
  width: 494px;
  padding-top: 65px;
  text-align: center;
`;

const SelectSNS = styled.div`
  color: var(--bs-primary);
  font-family: 'Poppins-Medium';
  font-weight: 500;
  line-height: 28px;
  font-size: 24px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 77px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 14px;
  color: var(--bs-body-color_active);
  margin-top: 40px;
  img {
    width: 24px;
  }
`;
