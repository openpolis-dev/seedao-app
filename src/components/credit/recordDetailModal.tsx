import BasicModal from 'components/modals/basicModal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StateTag from './stateTag';
import { CreditRecordStatus, ICreditRecord } from 'type/credit.type';
import publicJs from 'utils/publicJs';

interface IProps {
  data: ICreditRecord;
  handleClose: () => void;
}

export default function RecordDetailModal({ data, handleClose }: IProps) {
  const { t } = useTranslation();
  return (
    <RecordDetailModalStyle handleClose={handleClose} closeColor="#343C6A">
      <ModalTitle>{t('Credit.Records')}</ModalTitle>
      <Content>
        <div className="id">
          {t('Credit.BorrowID')}: {data.lendIdDisplay}
        </div>
        <TotalBox>
          <div className="amount">{data.borrowAmount.format()} USDT</div>
          <StateTag state={data.status} solid />
        </TotalBox>
        <DetailLines>
          <Line>
            <dt>{t('Credit.BorrowName')}</dt>
            <dd>{publicJs.AddressToShow(data.debtor)}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.Forfeit')}</dt>
            <dd>{data.mortgageSCRAmount.format()} SCR</dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowHash')}</dt>
            <dd>
              <a className="hash" href="http://" target="_blank" rel="noopener noreferrer">
                {publicJs.AddressToShow(data.borrowTx)}
              </a>
            </dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowTime')}</dt>
            <dd>{data.borrowTime}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.Rate')}</dt>
            <dd>{t('Credit.DayRate01', { rate: data.rate })}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.BorrowDuration')}</dt>
            <dd>{t('Credit.Days', { days: data.interestDays })}</dd>
          </Line>
          <Line>
            <dt>{t('Credit.TotalInterest')}</dt>
            <dd>{data.interestAmount} USDT</dd>
          </Line>
          <Line>
            <dt>{t('Credit.LastRepaymentTime')}</dt>
            <dd>{data.overdueTime}</dd>
          </Line>
        </DetailLines>
        {data.status === CreditRecordStatus.CLEAR && (
          <>
            <Divider />
            <RepayTtile>{t('Credit.RepayRecord')}</RepayTtile>
            <DetailLines>
              <Line>
                <dt>{t('Credit.TotalRepay')}</dt>
                <dd>{(data.borrowAmount + data.interestAmount).format()} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.Principal')}</dt>
                <dd>{data.borrowAmount.format()} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.Interest')}</dt>
                <dd>{data.interestAmount.format()} USDT</dd>
              </Line>
              <Line>
                <dt>{t('Credit.ForfeitRepay')}</dt>
                <dd>{data.mortgageSCRAmount.format()} SCR</dd>
              </Line>
              <Line>
                <dt>{t('Credit.RepayHash')}</dt>
                <dd>
                  <a className="hash" href="http://" target="_blank" rel="noopener noreferrer">
                    {publicJs.AddressToShow(data.paybackTx)}
                  </a>
                </dd>
              </Line>
              <Line>
                <dt>{t('Credit.RepayTime')}</dt>
                <dd>{data.paybackTime}</dd>
              </Line>
            </DetailLines>
          </>
        )}
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
