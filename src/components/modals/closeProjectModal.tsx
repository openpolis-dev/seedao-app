import styled from 'styled-components';
import BasicModal from './basicModal';
import { IApplicationDisplay } from 'type/application.type';
import { useTranslation } from 'react-i18next';
import ApplicationStatusTag from 'components/common/applicationStatusTag';

interface Iprops {
  application: IApplicationDisplay;
  handleClose: () => void;
}

export default function CloseProjectModal({ application, handleClose }: Iprops) {
  const { t } = useTranslation();
  return (
    <CloseProjectnModalWrapper handleClose={handleClose} title={t('application.DetailModalHeader')}>
      <Content>
        <Block underline>
          <li>
            <BlockLeft>{t('application.Project')}</BlockLeft>
            <BlockRight>{application.budget_source}</BlockRight>
          </li>
          <li>
            <BlockLeft className="text-field-label">{t('application.CloseReason')}</BlockLeft>
            <BlockRight className="text-field">{application.detailed_type}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('Project.State')}</BlockLeft>
            <BlockRight>
              <ApplicationStatusTag status={application.status} isProj={true} />
            </BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Applicant')}</BlockLeft>
            <BlockRight>{application.submitter_name}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.Auditor')}</BlockLeft>
            <BlockRight>{application.reviewer_name}</BlockRight>
          </li>
          <li>
            <BlockLeft>{t('application.ApplyTime')}</BlockLeft>
            <BlockRight>{application.created_date}</BlockRight>
          </li>
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
    border: 1px solid var(--bs-border-color);
    padding: 10px 16px;
    word-break: break-all;
  }
`;
