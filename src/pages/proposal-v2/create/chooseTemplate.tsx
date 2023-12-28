import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ProposalTemplateType } from 'type/proposal.type';
import { useTranslation } from 'react-i18next';
import { useCreateProposalContext } from './store';

export default function ChooseTemplateStep() {
  const { t } = useTranslation();
  const { proposalType, chooseTemplate } = useCreateProposalContext();
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
    ]);
  }, [proposalType]);

  return (
    <ListBox>
      <CreateBlankOne>+ {t('Proposal.CreateBlank')}</CreateBlankOne>
      {templates.map((template) => (
        <BaseTemplate key={template.id} onClick={() => chooseTemplate(template)}>
          {template.name}
        </BaseTemplate>
      ))}
    </ListBox>
  );
}

const ListBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;

const BaseTemplate = styled.li`
  cursor: pointer;
  border: 1px solid var(--bs-border-color);
  padding: 20px;
  border-radius: 8px;
`;

const CreateBlankOne = styled(BaseTemplate)``;
