import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ProposalTemplateType } from 'type/proposal.type';
import { useTranslation } from 'react-i18next';
import { useCreateProposalContext } from './store';
import AddImg from '../../../assets/Imgs/proposal/add-square.png';

export default function ChooseTemplateStep() {
  const { t } = useTranslation();
  const { proposalType, chooseTemplate, changeStep } = useCreateProposalContext();
  const [templates, setTemplates] = useState<ProposalTemplateType[]>([]);

  useEffect(() => {
    // TODO: filter templates by proposalType
    setTemplates([
      {
        id: 1,
        name: '公共项目',
      },
      {
        id: 2,
        name: '项目结项',
      },
      {
        id: 3,
        name: '项目结项2',
      },
      {
        id: 2,
        name: '项目结项项目结项项目结项项目结项',
      },
      {
        id: 3,
        name: '项目结项2',
      },
    ]);
  }, [proposalType]);

  return (
    <ListBox>
      <CreateBlankOne onClick={() => changeStep(3)}>
        <InnerBox>
          <ImgBox>
            <img src={AddImg} alt="" />
          </ImgBox>
          <TitleBox>{t('Proposal.CreateBlank')}</TitleBox>
        </InnerBox>
      </CreateBlankOne>
      {templates.map((template) => (
        <BaseTemplate key={template.id} onClick={() => chooseTemplate(template)}>
          <InnerBox>
            <PicBox></PicBox>
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
  background: #f8f5ff;
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
