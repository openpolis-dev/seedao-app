import styled from 'styled-components';
import BasicModal from './basicModal';
import { useTranslation } from 'react-i18next';
import ApplicationStatusTagNew from 'components/common/applicationStatusTagNew';
import { Button } from 'react-bootstrap';
import { PinkButton } from 'components/common/button';
import requests from '../../requests';
import { ToastType } from '../../hooks/useToast';
import { ApplicationStatus, IApplicationDisplay } from 'type/application.type';
import { useNavigate } from 'react-router-dom';

interface Iprops {
  application: IApplicationDisplay;
  handleClose: () => void;
  handleApprove: (arg: number) => void;
  handleReject: (arg: number) => void;
}

export default function CloseProjectModal({ application, handleClose, handleApprove, handleReject }: Iprops) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toGo = (id: string, type: string) => {
    if (type === 'project') {
      navigate(`/project/info/${id}`);
    }
  };

  return (
    // <CloseProjectnModalWrapper handleClose={handleClose} title={t('application.DetailModalHeader')}>
    <CloseProjectnModalWrapper handleClose={handleClose}>
      <Content>
        <Block>
          <li>
            <BlockLeft>{t('application.Project')}</BlockLeft>
            <BlockRight>
              {application.budget_source}{' '}
              <TagBox onClick={() => toGo(application.entity_id, application.entity_type)}>
                {t('application.detail')}
              </TagBox>
            </BlockRight>
          </li>
          <li>
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
            <BlockRight>{application.submitter_name}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ApplyTime')}</BlockLeft>
            <BlockRight>{application.created_date}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Auditor')}</BlockLeft>
            <BlockRight>{application.reviewer_name}</BlockRight>
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
    padding-block: 10px;
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

const TagBox = styled.div`
  border-radius: 8px;
  border: 1px solid #0085ff;
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  color: #2f8fff;
  line-height: 20px;
  padding: 0 10px;
  margin-left: 10px;
`;
