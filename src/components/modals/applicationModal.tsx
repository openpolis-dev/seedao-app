import styled from 'styled-components';
import BasicModal from './basicModal';
import { IApplicationDisplay } from 'type/application.type';
import { useTranslation } from 'react-i18next';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import publicJs from 'utils/publicJs';

interface Iprops {
  application: IApplicationDisplay;
  handleClose: () => void;
  snsMap: Map<string, string>;
}

export default function ApplicationModal({ application, handleClose, snsMap }: Iprops) {
  const { t } = useTranslation();

  const formatScan = () =>{
    let str
    if(application.asset_name === "SCR"){
       str = "polygonscan.com"
    }else if(application.asset_name === "USDC"){
      str = "etherscan.io"
    }
    return str;
  }
  return (
    <ApplicationModalWrapper handleClose={handleClose} title={t('application.DetailModalHeader')}>
      <Content>
        <Block underline>
          <li>
            <BlockLeft>{t('application.Receiver')}</BlockLeft>
            <BlockRight>{snsMap.get(application.target_user_wallet.toLocaleLowerCase())}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.AddAssets')}</BlockLeft>
            <BlockRight>{application.asset_display}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.OutputVault')}</BlockLeft>
            <BlockRight>{t('application.CityhallVault')}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.State')}</BlockLeft>
            <BlockRight>
              <ApplicationStatusTagNew status={application.status} />
            </BlockRight>
          </li>
        </Block>
        <Block underline>
          <li>
            <BlockLeft>{t('application.Season')}</BlockLeft>
            <BlockRight>{application.season_name}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.BudgetSource')}</BlockLeft>
            <BlockRight>{application.budget_source}</BlockRight>
          </li>
          <li>
            <BlockLeft className="text-field-label">{t('application.Content')}</BlockLeft>
            <BlockRight className="text-field">{application.detailed_type}</BlockRight>
          </li>
          <li>
            <BlockLeft className="text-field-label">{t('application.RegisterNote')}</BlockLeft>
            <BlockRight className="text-field">{application.comment}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Operator')}</BlockLeft>
            <BlockRight>
              {application.applicant_wallet && snsMap.get(application.applicant_wallet.toLocaleLowerCase())}
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ApplyTime')}</BlockLeft>
            <BlockRight>{application.created_date}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ApplyIntro')}</BlockLeft>
            <BlockRight>{application.app_bundle_comment}</BlockRight>
          </li>
        </Block>
        <Block>
          <li>
            <BlockLeft>{t('application.Auditor')}</BlockLeft>
            <BlockRight>{snsMap.get(application.reviewer_wallet.toLocaleLowerCase())}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.AuditTime')}</BlockLeft>
            <BlockRight>{application.review_date}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.TransactionID')}</BlockLeft>
            <BlockRight>
              {application.transactions?.map((item, index) => {
                return item ? (
                  <TransactionTx key={index} href={`https://${formatScan()}/tx/${item}`} target="_blank">
                    {publicJs.AddressToShow(item, 8)}
                  </TransactionTx>
                ) : (
                  <></>
                );
              })}
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ProcessTime')}</BlockLeft>
            <BlockRight>{application.complete_date}</BlockRight>
          </li>
        </Block>
      </Content>
    </ApplicationModalWrapper>
  );
}

const ApplicationModalWrapper = styled(BasicModal)`
  width: 635px;
  padding: 24px;
  .modal-header {
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  font-size: 14px;
  max-height: 85vh;
  padding-right: 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  section {
    display: flex;
    gap: 37px;
  }
`;

const Block = styled.ul<{ underline?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-block: 16px;
  border-bottom: ${({ underline }) => (underline ? '1px solid var(--bs-border-color)' : 'none')};
  li {
    display: flex;
    gap: 20px;
    min-height: 24px;
  }
  &:first-child {
    padding-top: 26px;
  }
  &:last-child {
    padding-bottom: 0;
  }
`;

const BlockLeft = styled.div`
  color: var(--bs-body-color);
  min-width: 102px;
  /* &.text-field-label {
    line-height: 40px;
  } */
`;
const BlockRight = styled.div`
  flex: 1;
  color: var(--bs-body-color_active);
  &.text-field {
    border-radius: 8px;
    /* padding-block: 10px; */
    word-break: break-all;
  }
`;

const TransactionTx = styled.a`
  display: block;
  color: var(--bs-primary);
  text-decoration: underline;
`;
