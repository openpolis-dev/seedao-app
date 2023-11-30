import styled from 'styled-components';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import { Button } from 'react-bootstrap';
import { PinkButton } from 'components/common/button';
import { ApplicationStatus, IApplicationDisplay } from 'type/application.type';

interface Iprops {
  application: IApplicationDisplay;
  handleClose: () => void;
  handleApprove: (arg: number) => void;
  handleReject: (arg: number) => void;
  snsMap: Map<string, string>;
}

export default function CloseProjectModal({ application, handleClose, handleApprove, handleReject, snsMap }: Iprops) {
  const { t } = useTranslation();

  return (
    // <CloseProjectnModalWrapper handleClose={handleClose} title={t('application.DetailModalHeader')}>
    <CloseProjectnModalWrapper handleClose={handleClose}>
      <Content>
        <Block>
          <li>
            <BlockLeft>{t('application.Project')}</BlockLeft>
            <BlockRight>
              {application.budget_source}{' '}
              <TagBox href={`${window.location.origin}/project/info/${application.entity_id}`} target="_blank">
                {t('application.detail')}
              </TagBox>
            </BlockRight>
          </li>
          <li style={{ height: 'unset' }}>
            <BlockLeft className="text-field-label">{t('application.CloseReason')}</BlockLeft>
            <BlockRight className="text-field">{application.detailed_type}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.State')}</BlockLeft>
            <BlockRight>
              <ApplicationStatusTagNew status={application.status} isProj={true} />
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Applicant')}</BlockLeft>
            <BlockRight>
              {application.applicant_wallet && snsMap.get(application.applicant_wallet.toLocaleLowerCase())}
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ApplyTime')}</BlockLeft>
            <BlockRight>{application.created_date}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Auditor')}</BlockLeft>
            <BlockRight>{snsMap.get(application.reviewer_wallet.toLocaleLowerCase())}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.AuditTime')}</BlockLeft>
            <BlockRight>{application.review_date}</BlockRight>
          </li>

          <LiBox>
            <Button
              onClick={() => handleApprove(application.application_id)}
              disabled={application.status !== ApplicationStatus.Open}
            >
              {t('city-hall.Pass')}
            </Button>
            <PinkButton
              onClick={() => handleReject(application.application_id)}
              disabled={application.status !== ApplicationStatus.Open}
            >
              {t('city-hall.Reject')}
            </PinkButton>
          </LiBox>
        </Block>
      </Content>
    </CloseProjectnModalWrapper>
  );
}

const CloseProjectnModalWrapper = styled(BasicModal)`
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
    height: 24px;
  }
`;

const BlockLeft = styled.div`
  color: var(--bs-body-color);
  min-width: 102px;
`;
const BlockRight = styled.div`
  flex: 1;
  color: var(--bs-body-color_active);
  &.text-field {
    line-height: 22px;
    word-break: break-all;
  }
`;

const LiBox = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  .btn {
    min-width: 110px;
  }
`;

const TagBox = styled.a`
  display: inline-block;
  border-radius: 8px;
  border: 1px solid #0085ff;
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  color: #2f8fff;
  &:hover {
    color: #2f8fff;
  }
  line-height: 20px;
  padding: 0 10px;
  margin-left: 10px;
`;
