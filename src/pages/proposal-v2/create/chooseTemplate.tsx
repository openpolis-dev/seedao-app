import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ProposalTemplateType } from 'type/proposal.type';
import { useTranslation } from 'react-i18next';
import { useCreateProposalContext } from './store';
import AddImg from '../../../assets/Imgs/proposal/add-square.png';
import { AppActionType, useAuthContext } from '../../../providers/authProvider';
import requests from '../../../requests';
import { getTemplate } from '../../../requests/proposalV2';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';

export default function ChooseTemplateStep() {
  const { t } = useTranslation();
  const { proposalType, chooseTemplate, changeStep } = useCreateProposalContext();
  const [templates, setTemplates] = useState<ProposalTemplateType[]>([]);

  const {
    state: { loading },
    dispatch,
  } = useAuthContext();

  useEffect(() => {
    getList();
  }, [proposalType]);

  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposalV2.getTemplate();
      console.log(resp.data);
      setTemplates(resp.data);
    } catch (error) {
      logError('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  return (
    <ListBox>
      {canUseCityhall && (
        <CreateBlankOne onClick={() => chooseTemplate({ id: 0 })}>
          <InnerBox>
            <ImgBox>
              <img src={AddImg} alt="" />
            </ImgBox>
            <TitleBox>{t('Proposal.CreateBlank')}</TitleBox>
          </InnerBox>
        </CreateBlankOne>
      )}

      {templates.map((template) => (
        <BaseTemplate key={template.id} onClick={() => chooseTemplate(template)}>
          <InnerBox>
            <PicBox>
              <img src={template.screenshot_uri} alt="" />
            </PicBox>
            <TitleBox>{template.name}</TitleBox>
          </InnerBox>
        </BaseTemplate>
      ))}
    </ListBox>
  );
}

const ListBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 820px;
  align-items: center;
  margin: 100px auto 20px;
`;

const BaseTemplate = styled.li`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
`;

const CreateBlankOne = styled(BaseTemplate)``;

const InnerBox = styled.div`
  cursor: pointer;
  height: 219px;
  width: 170px;
  border-radius: 8px;
  border: 1px solid rgba(180, 147, 249, 0.5);
  background-color: var(--bs-box-background);
  box-shadow: 2px 2px 5px 0px rgba(97, 94, 105, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &:hover {
    border: 1px solid rgba(96, 20, 255, 0.5);
  }
  &:active {
    border: 1px solid rgba(96, 20, 255, 0.5);
    outline: 5px solid rgba(173, 134, 252, 0.2);
  }
`;

const ImgBox = styled.div`
  border-radius: 8px;
  background: rgba(82, 0, 255, 0.08);
  display: flex;
  width: 136px;
  height: 149px;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--proposal-border);
`;

const PicBox = styled.div`
  border-radius: 8px;
  background: var(--bs-d-button-bg);
  display: flex;
  width: 136px;
  height: 149px;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--proposal-border);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;
const TitleBox = styled.div`
  width: 100%;
  padding: 16px 16px 0;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
`;
