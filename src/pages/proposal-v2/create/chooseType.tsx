import styled from 'styled-components';
import { useCreateProposalContext } from './store';
import { useTranslation } from 'react-i18next';
import { PROPOSAL_TYPES, ProposalType } from 'type/proposal.type';

export default function ChooseTypeStep() {
  const { t } = useTranslation();
  const { chooseProposalType } = useCreateProposalContext();

  const onChooseType = (tp: ProposalType) => {
    chooseProposalType(tp);
  };

  return (
    <Container>
      <CenterBox>
        <StepTitle>{t('Proposal.ChooseType')}</StepTitle>
        <TypeBox>
          {PROPOSAL_TYPES.map((tp, index) => (
            <li key={index} onClick={() => onChooseType(tp)}>
              {t(tp.name as any)}
            </li>
          ))}
        </TypeBox>
      </CenterBox>
    </Container>
  );
}

const Container = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenterBox = styled.div`
  background-color: var(--bs-box-background);
  width: 669px;
  box-shadow: 2px 4px 4px 0px var(--box-shadow);
  border-radius: 16px;
  text-align: center;
  position: relative;
  padding-block: 40px;
`;

const StepTitle = styled.div`
  font-family: Poppins-Medium;
  font-size: 20px;
`;

const TypeBox = styled.ul`
  li {
    margin-top: 16px;
    border: 1px solid var(--bs-border-color);
    width: 70%;
    font-size: 16px;
    line-height: 40px;
    margin: 10px auto;
    border-radius: 8px;
    cursor: pointer;
    &:first-child {
      margin-top: 24px;
    }
    &:hover {
      border-color: var(--bs-body-color_active);
    }
  }
`;
