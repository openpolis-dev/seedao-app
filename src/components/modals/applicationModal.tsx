import styled from 'styled-components';
import BasicModal from './basicModal';
import { IApplicationDisplay } from 'type/application.type';
import { useTranslation } from 'react-i18next';
import { formatNumber } from 'utils/number';
import { formatApplicationStatus } from 'utils/index';
import ApplicationStatusTag from 'components/common/applicationStatusTag';

interface Iprops {
  application: IApplicationDisplay;
  handleClose: () => void;
}

export default function ApplicationModal({ application, handleClose }: Iprops) {
  const { t } = useTranslation();
  return (
    <ApplicationModalWrapper handleClose={handleClose} title={t('application.DetailModalHeader')}>
      <Content>
        <Block underline>
          <li>
            <BlockLeft>{t('Project.Address')}</BlockLeft>
            <BlockRight>{application.target_user_wallet}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.AddPoints')}</BlockLeft>
            <BlockRight>{formatNumber(application.credit_amount)}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.AddToken')}</BlockLeft>
            <BlockRight>{formatNumber(application.token_amount)}</BlockRight>
          </li>

          <li>
            <BlockLeft>{t('Project.BudgetSource')}</BlockLeft>
            <BlockRight>{application.budget_source}</BlockRight>
          </li>
          <li>
            <BlockLeft className="text-field-label">{t('Project.Content')}</BlockLeft>
            <BlockRight className="text-field">{application.detailed_type}</BlockRight>
          </li>
          <li>
            <BlockLeft className="text-field-label">{t('Project.Note')}</BlockLeft>
            <BlockRight className="text-field">{application.comment}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.State')}</BlockLeft>
            <BlockRight>
              <ApplicationStatusTag status={application.status} />
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.Operator')}</BlockLeft>
            <BlockRight>{application.submitter_name || application.submitter_wallet}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.Auditor')}</BlockLeft>
            <BlockRight>{application.reviewer_name || application.reviewer_wallet}</BlockRight>
          </li>
        </Block>
        <Block>
          <li>
            <BlockLeft>{t('Project.TransactionID')}</BlockLeft>
            <BlockRight>
              {application.transactions?.map((item, index) => (
                <TransactionTx key={index} href={`https://etherscan.io/tx/${item}`} target="_blank">
                  {item.slice(0, 8) + '...' + item.slice(-8)}
                </TransactionTx>
              ))}
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.Time')}</BlockLeft>
            <BlockRight>{application.created_date}</BlockRight>
          </li>
        </Block>
      </Content>
    </ApplicationModalWrapper>
  );
}

const ApplicationModalWrapper = styled(BasicModal)`
  width: 635px;
  .modal-header {
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  font-size: 14px;
  section {
    display: flex;
    gap: 37px;
  }
`;

const Block = styled.ul<{ underline?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-block: 24px;
  border-bottom: ${({ underline }) => (underline ? '1px solid var(--bs-border-color)' : 'none')};
  li {
    display: flex;
    gap: 20px;
    min-height: 18px;
  }
`;

const BlockLeft = styled.div`
  color: var(--bs-body-color);
  min-width: 102px;
  &.text-field-label {
    line-height: 40px;
  }
`;
const BlockRight = styled.div`
  flex: 1;
  color: var(--bs-body-color_active);
  &.text-field {
    border-radius: 8px;
    border: 1px solid var(--bs-border-color);
    padding: 10px 16px;
  }
`;

const TransactionTx = styled.a`
  display: block;
  color: var(--bs-primary);
  text-decoration: underline;
`;
