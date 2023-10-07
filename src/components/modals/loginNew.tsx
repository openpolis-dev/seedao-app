import { useAuthContext, AppActionType } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useToast from 'hooks/useToast';
import { useTranslation } from 'react-i18next';
import { X } from 'react-bootstrap-icons';

import Metamask from '../login/metamask';
import Unipass from '../login/unipass';
import Joyid from '../login/joyid';
import { Wallet, WalletType } from '../../wallet/wallet';
import { injected, uniPassWallet } from '../../wallet/connector';
import MetamaskIcon from '../../assets/images/wallet/metamask.png';
import UnipassIcon from '../../assets/images/wallet/unipass.svg';
import JoyIdImg from 'assets/images/wallet/joyid.png';

const WalletOption = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  padding: 10px 28px;
  border-radius: 8px;
  margin-block: 10px;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f1f1;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: #f5f5f5;
  }
  img {
    width: 28px;
    height: 28px;
  }
`;

export default function LoginModal({ showModal }: any) {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();
  const [type, setType] = useState<string | undefined>();

  const closeModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  type LoginWallet = {
    name: string;
    value: Wallet;
    iconURL: string;
    type: WalletType;
  };

  const LOGIN_WALLETS: LoginWallet[] = [
    {
      name: 'MetaMask',
      value: Wallet.METAMASK,
      iconURL: MetamaskIcon,
      type: WalletType.EOA,
    },
    {
      name: 'Unipass',
      value: Wallet.UNIPASS,
      iconURL: UnipassIcon,
      type: WalletType.AA,
    },
    {
      name: 'JoyID',
      value: Wallet.JOYID,
      iconURL: JoyIdImg,
      type: WalletType.EOA,
    },
  ];

  const selectType = (item: string | undefined) => {
    setType(item);
    localStorage.setItem('select_wallet', item!);
  };

  useEffect(() => {
    let type = localStorage.getItem('select_wallet');
    if (!type) return;
    setType(type);
  }, []);

  return (
    <Mask show={showModal}>
      {/*{Toast}*/}
      <Modal>
        <span className="icon-close" onClick={closeModal}>
          {/*<EvaIcon name="close-outline" />*/}
          <X />
        </span>

        <Title>{t('general.ConnectWallet')}</Title>
        {type === Wallet.METAMASK && (
          <Metamask
            callback={() => {
              selectType(undefined);
            }}
          />
        )}
        {type === Wallet.UNIPASS && (
          <Unipass
            callback={() => {
              selectType(undefined);
            }}
          />
        )}
        {type === Wallet.JOYID && (
          <Joyid
            callback={() => {
              selectType(undefined);
            }}
          />
        )}

        <Content>
          {LOGIN_WALLETS.map((w) => (
            <WalletOption key={w.value} onClick={() => selectType(w.value)}>
              <span>{w.name}</span>
              <span>
                <img src={w.iconURL} alt="" width="28px" height="28px" />
              </span>
            </WalletOption>
          ))}
        </Content>
      </Modal>
    </Mask>
  );
}

interface ShowProps {
  show: boolean;
}

const Mask = styled.div<ShowProps>`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 51, 46, 0.6);
  display: ${(props) => (props.show ? 'flex' : 'none')};

  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 400px;
  height: 330px;
  opacity: 1;
  border-radius: 8px;
  background: #fff linear-gradient(90deg, rgba(235, 255, 255, 0.6) 0%, rgba(230, 255, 255, 0) 100%);
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    font-size: 24px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const Content = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
