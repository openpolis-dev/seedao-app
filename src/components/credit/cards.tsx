import { useState } from 'react';

import styled from 'styled-components';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useCheckLogin from 'hooks/useCheckLogin';
import { useTranslation } from 'react-i18next';
import CreditLogo from 'assets/Imgs/light/creditLogo.svg';
import CreditLogo2 from 'assets/Imgs/light/creditLogo2.svg';
import TipIcon from 'assets/Imgs/light/tip.svg';
import { BorrowItemsModal, RepayItemsModal } from './itemsModal';
import BorrowModal from './borrowModal';
import RepayModal from './repayModal';

const RightArrowIcon = () => (
  <svg
    fill="#ffffff"
    width="36px"
    height="36px"
    viewBox="-1.92 -1.92 27.84 27.84"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#ffffff"
    stroke-width="0.00024000000000000003"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="#CCCCCC"
      stroke-width="0.336"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M11.999 1.993c-5.514.001-10 4.487-10 10.001s4.486 10 10.001 10c5.513 0 9.999-4.486 10-10 0-5.514-4.486-10-10.001-10.001zM12 19.994c-4.412 0-8.001-3.589-8.001-8s3.589-8 8-8.001C16.411 3.994 20 7.583 20 11.994c-.001 4.411-3.59 8-8 8z"></path>
      <path d="M12 10.994H8v2h4V16l4.005-4.005L12 7.991z"></path>
    </g>
  </svg>
);

type BorrowCardProps = {
  isLogin: boolean;
  onClickLogin: () => void;
  onOpenBorrow: () => void;
};

const MyBorrowingQuota = ({ isLogin, onClickLogin, onOpenBorrow }: BorrowCardProps) => {
  const { t } = useTranslation();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showBorrowItemsModal, setShowBorrowItemsModal] = useState(false);
  const onClickBottom = () => {
    isLogin ? setShowBorrowItemsModal(true) : onClickLogin();
  };

  const go2Borrow = () => {
    setShowBorrowItemsModal(false);
    setShowBorrowModal(true);
  };

  const closeBorrowModal = (openMine?: boolean) => {
    setShowBorrowModal(false);
    if (openMine) {
      // TODO
    }
  };
  return (
    <CardStyle>
      <img src={CreditLogo} alt="" className="logo" />
      <MyCardTop>
        <MyCardLine>
          <div className="label">{t('Credit.MyBorrowQuota')}</div>
          {isLogin ? (
            <div className="value">
              <span className="num">100,000.00</span>
              <span className="unit">USDT</span>
            </div>
          ) : (
            <div className="secret">*********</div>
          )}
        </MyCardLine>
        <MyCardTipLine>{t('Credit.MyBorrowTip')}</MyCardTipLine>
        <MyCardColomnLine>
          <div>
            <div className="label">{t('Credit.MySCR')}</div>
            {isLogin ? <div className="value">100,000.00</div> : <div className="secret">*********</div>}
          </div>
          <div>
            <div className="label">{t('Credit.TotalQuota')}</div>
            {isLogin ? (
              <div>
                <span className="value">100,000.00</span>
                <span className="unit">usdt</span>
              </div>
            ) : (
              <div className="secret">*********</div>
            )}
          </div>
        </MyCardColomnLine>
      </MyCardTop>
      <MyCardBottom onClick={onClickBottom}>
        <span>{isLogin ? t('Credit.GoToBorrow') : t('Credit.CardLogin')}</span>
        <span>
          <RightArrowIcon />
        </span>
      </MyCardBottom>
      {showBorrowItemsModal && <BorrowItemsModal onConfirm={go2Borrow} />}
      {showBorrowModal && <BorrowModal handleClose={closeBorrowModal} />}
    </CardStyle>
  );
};

const MyBorrowing = ({ isLogin, onClickLogin, onOpenBorrow }: BorrowCardProps) => {
  const { t } = useTranslation();
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [showRepayItemsModal, setShowRepayItemsModal] = useState(false);
  const onClickBottom = () => {
    isLogin ? setShowRepayItemsModal(true) : onClickLogin();
  };
  const go2Repay = () => {
    setShowRepayItemsModal(false);
    setShowRepayModal(true);
  };

  const closeRepayModal = (openMine?: boolean) => {
    setShowRepayModal(false);
    if (openMine) {
      // TODO
    }
  };
  return (
    <CardStyle2>
      <img src={CreditLogo} alt="" className="logo" />
      <MyCardTop>
        <MyCardLine>
          <div className="label">{t('Credit.MyBorrow')}</div>
          {!isLogin ? (
            <div className="value">
              <span className="num">100,000.00</span>
              <span className="unit">USDT</span>
            </div>
          ) : (
            <div className="secret">*********</div>
          )}
        </MyCardLine>
        <MyCardTipLine2>
          <div>
            {t('Credit.LatestRepaymentDate')}
            {isLogin ? '2024-02-02' : '*******'}
          </div>
          <div>
            <span>{t('Credit.MyBorrowTip2')}</span>
            <span>
              <img className="icon" src={TipIcon} alt="" />
            </span>
          </div>
        </MyCardTipLine2>
        <MyCardColomnLine>
          <div>
            <div className="label">{t('Credit.CurrentBorrow', { num: isLogin ? 1 : '*' })}</div>
            {isLogin ? <div className="value">100,000.00</div> : <div className="secret">*********</div>}
          </div>
          <div>
            <div className="label">{t('Credit.Overdue', { num: isLogin ? 1 : '*' })}</div>
            {isLogin ? (
              <div>
                <span className="value">100,000.00</span>
                <span className="unit">USDT</span>
              </div>
            ) : (
              <div className="secret">*********</div>
            )}
          </div>
        </MyCardColomnLine>
      </MyCardTop>
      <MyCardBottom onClick={onClickBottom}>
        <span>{isLogin ? t('Credit.GoToRepay') : t('Credit.CardLogin')}</span>
        <span>
          <RightArrowIcon />
        </span>
      </MyCardBottom>
      {showRepayItemsModal && <RepayItemsModal onConfirm={go2Repay} />}
      {showRepayModal && <RepayModal handleClose={closeRepayModal} />}
    </CardStyle2>
  );
};

const VaultCard = () => {
  const { t } = useTranslation();
  return (
    <CardStyle3>
      <img src={CreditLogo2} alt="" className="logo" />

      <div>
        <div className="label">{t('Credit.DaoTotalQuota')}</div>
        <div>
          <span className="value">100,000.00</span>
          <span className="unit">USDT</span>
        </div>
      </div>
      <div className="tip">{t('Credit.DaoTip')}</div>
      <VaultCardColumnLine>
        <div>
          <div className="label">{t('Credit.TotalBorrow', { num: 123 })}</div>
          <div className="value">
            <span>343,377.00</span>
            <span className="unit">USDT</span>
          </div>
        </div>
        <div>
          <div className="label">{t('Credit.TotalClear', { num: 123 })}</div>
          <div className="value">
            <span>343,377.00</span>
            <span className="unit">USDT</span>
          </div>
        </div>
      </VaultCardColumnLine>
      <VaultCardColumnLine>
        <div>
          <div className="label">{t('Credit.TotalOverdue', { num: 123 })}</div>
          <div className="value">
            <span>343,377.00</span>
            <span className="unit">USDT</span>
          </div>
        </div>
        <div>
          <div className="label">{t('Credit.TotalForfeit', { num: 123 })}</div>
          <div className="value">
            <span>343,377.00</span>
            <span className="unit">SCR</span>
          </div>
        </div>
      </VaultCardColumnLine>
    </CardStyle3>
  );
};

export default function CreditCards() {
  const {
    dispatch,
    state: { account },
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  const loginStatus = isLogin && !!account;

  const openLogin = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };
  const openBorrow = () => {};
  return (
    <CardsRow>
      <MyBorrowingQuota isLogin={!!loginStatus} onClickLogin={openLogin} onOpenBorrow={openBorrow}></MyBorrowingQuota>
      <MyBorrowing isLogin={!!loginStatus} onClickLogin={openLogin} onOpenBorrow={openBorrow}></MyBorrowing>
      <VaultCard />
    </CardsRow>
  );
}

const CardsRow = styled.div`
  display: flex;
  gap: 32px;
  > div {
    flex: 1;
  }
`;

const CardStyle = styled.div`
  height: 225px;
  border-radius: 25px;
  background: linear-gradient(107.38deg, #2d60ff 2.61%, #539bff 101.2%);
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
  img.logo {
    position: absolute;
    right: 24px;
    top: 20px;
  }
`;

const CardStyle2 = styled(CardStyle)`
  background: linear-gradient(107.38deg, #4c49ed 2.61%, #0a06f4 101.2%);
`;

const CardStyle3 = styled(CardStyle)`
  background: #fff;
  border: 1px solid #dfeaf2;
  padding: 26px;
  color: #343c6a;
  .value {
    font-size: 24px;
  }
  .unit {
    font-size: 12px;
    margin-left: 6px;
  }
  .label {
    font-size: 12px;
    color: #718ebf;
  }
  .tip {
    color: #0a06f4;
    font-size: 12px;
    margin-bottom: 8px;
    cursor: pointer;
  }
`;

const MyCardTop = styled.div`
  padding: 26px;
  padding-bottom: 0;
  flex: 1;
  position: relative;
`;

const MyCardBottom = styled.div`
  font-size: 18px;
  padding-inline: 26px;
  line-height: 58px;
  height: 58px;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  cursor: pointer;
`;

const MyCardLine = styled.div`
  .label {
    font-size: 12px;
  }
  .value {
    .num {
      font-size: 24px;
      margin-right: 6px;
    }
    .unit {
      font-size: 12px;
    }
  }
  .secret {
    margin-top: 6px;
    font-size: 24px;
    height: 29px;
    line-height: 29px;
  }
`;

const MyCardTipLine = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #ff7193;
  line-height: 15px;
  width: calc(100% - 60px);
`;

const MyCardTipLine2 = styled(MyCardTipLine)`
  .icon {
    position: relative;
    top: -1px;
    left: 3px;
  }
`;

const MyCardColomnLine = styled.div`
  margin-top: 10px;
  display: flex;
  > div {
    flex: 1;
  }
  .label {
    opacity: 0.7;
    font-size: 12px;
  }
  .value {
    font-size: 15px;
  }
  .unit {
    font-size: 12px;
    margin-left: 4px;
  }
`;

const VaultCardColumnLine = styled.div`
  margin-top: 8px;
  display: flex;
  > div {
    flex: 1;
  }
  .value {
    font-size: 15px;
  }
  .unit {
    font-size: 10px;
    margin-left: 4px;
  }
`;
