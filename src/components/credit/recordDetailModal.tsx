import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StateTag from './stateTag';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import publicJs from 'utils/publicJs';
import { amoy } from 'utils/chain';
import { useCreditContext } from 'pages/credit/provider';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import getConfig from 'utils/envCofnig';

const lendToken = getConfig().NETWORK.lend.lendToken;

interface IProps {
  borrowName: string;
  data: ICreditRecord;
  handleClose: () => void;
}

export default function RecordDetailModal({ borrowName, data, handleClose }: IProps) {
  const { t } = useTranslation();

  const [fullData, setFullData] = useState<ICreditRecord>(data);
  const {
    state: { bondNFTContract },
  } = useCreditContext();

  useEffect(() => {
    if (data.interestDays === 0 && data.status === CreditRecordStatus.INUSE) {
      bondNFTContract
        ?.calculateInterest(Number(data.lendId))
        .then((r: { interestDays: ethers.BigNumber; interestAmount: ethers.BigNumber }) => {
          const newData: ICreditRecord = {
            ...data,
            interestDays: r.interestDays.toNumber(),
            interestAmount: Number(ethers.utils.formatUnits(r.interestAmount, lendToken.decimals)),
          };
          setFullData(newData);
        });
    } else {
      setFullData(data);
    }
  }, [data]);

  return (
    <RecordDetailModalStyle handleClose={handleClose} closeColor="#343C6A">
      <ModalTitle>{t('Credit.Records')}</ModalTitle>
      <Content>
        <div className="id">
          {t('Credit.BorrowID')}: {data.lendIdDisplay}
        </div>
        <TotalBox>
          <div className="amount">{fullData.borrowAmount.format()} USDT</div>
          <StateTag state={fullData.status} solid />
        </TotalBox>
        <DetailLines>
          <Line>
            <dt>{t('Credit.BorrowName')}</dt>
            <dd>{borrowName}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.Forfeit')}</dt>
            <dd>{fullData.mortgageSCRAmount.format()} SCR</dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowHash')}</dt>
            <dd>
              <a
                className="hash"
                href={`${amoy?.blockExplorers?.default.url}/tx/${fullData.borrowTx}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {publicJs.AddressToShow(fullData.borrowTx)}
              </a>
            </dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowTime')}</dt>
            <dd>{fullData.borrowTime}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.Rate')}</dt>
            <dd>{t('Credit.DayRate01', { rate: fullData.rate })}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowDuration')}</dt>
            <dd>
              {fullData.status === CreditRecordStatus.OVERDUE ? (
                <NoData>-</NoData>
              ) : (
                t('Credit.Days', { days: fullData.interestDays })
              )}
            </dd>
          </Line>
          <Line>
            <dt>{t('Credit.TotalInterest')}</dt>
            <dd>
              {fullData.status === CreditRecordStatus.OVERDUE ? <NoData>-</NoData> : `${fullData.interestAmount} USDT`}
            </dd>
          </Line>
          <Line>
            <dt>{t('Credit.LastRepaymentTime')}</dt>
            <dd>{fullData.overdueTime}</dd>
          </Line>
        </DetailLines>
        {fullData.status === CreditRecordStatus.CLEAR && (
          <>
            <Divider />
            <RepayTtile>{t('Credit.RepayRecord')}</RepayTtile>
            <DetailLines>
              <Line>
                <dt>{t('Credit.TotalRepay')}</dt>
                <dd className="total">{fullData.borrowAmount + fullData.interestAmount} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.Principal')}</dt>
                <dd>{fullData.borrowAmount.format()} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.Interest')}</dt>
                <dd>{fullData.interestAmount} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.ForfeitRepay')}</dt>
                <dd>{fullData.mortgageSCRAmount.format()} SCR</dd>
              </Line>
              <Line>
                <dt>{t('Credit.RepayHash')}</dt>
                <dd>
                  <a
                    className="hash"
                    href={`${amoy?.blockExplorers?.default.url}/tx/${fullData.paybackTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {publicJs.AddressToShow(fullData.paybackTx)}
                  </a>
                </dd>
              </Line>
              <Line>
                <dt>{t('Credit.RepayTime')}</dt>
                <dd>{fullData.paybackTime}</dd>
              </Line>
            </DetailLines>
          </>
        )}
        <InterestTip>{t('Credit.BorrowTip2')}</InterestTip>
      </Content>
    </RecordDetailModalStyle>
  );
}

const RecordDetailModalStyle = styled(BasicModal)`
  width: 670px;
  font-family: inter;
  .btn-close-modal {
    right: 26px;
    top: 26px;
  }
`;

const Content = styled.div`
  .id {
    color: #718ebf;
    font-size: 14px;
    text-align: center;
    margin-top: 4px;
  }
  padding-inline: 60px;
`;

const TotalBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 20px;
  .amount {
    color: #1814f3;
    font-size: 20px;
    font-family: Inter-SemiBold;
    line-height: 25px;
  }
`;

const DetailLines = styled.div``;

const Line = styled.dl`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-block: 7px;
  dt {
    font-weight: 400;
    color: #718ebf;
  }
  dd {
    color: #343c6a;
  }
  .hash {
    color: #1814f3;
  }
  .total {
    font-size: 16px;
    font-weight: 600;
    font-family: 'Inter-SemiBold';
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #718ebf;
  margin-block: 20px;
`;

const RepayTtile = styled.div`
  color: #343c6a;
  font-size: 16px;
  font-family: Inter-SemiBold;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ModalTitle = styled.div`
  font-size: 20px;
  text-align: center;
  color: #343c6a;
  font-family: Inter-SemiBold;
  font-weight: 600;
  margin-top: 14px;
`;

const NoData = styled.span`
  color: red;
`;

const InterestTip = styled.p`
  color: #1814f3;
  font-size: 14px;
  margin-top: 22px;
`;
