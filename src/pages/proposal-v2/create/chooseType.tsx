import styled from 'styled-components';
import { useCreateProposalContext } from './store';
import { useTranslation } from 'react-i18next';
import useProposalCategories from 'hooks/useProposalCategories';
import { IBaseCategory } from 'type/proposalV2.type';
import ArrowRht from '../../../assets/Imgs/proposal/chevron-down.svg';
import ArrowRhtBlack from '../../../assets/Imgs/proposal/chevron-down-black.svg';
import ArrowGray from 'assets/Imgs/proposal/chevron-gray.svg';
import { useAuthContext } from '../../../providers/authProvider';

export default function ChooseTypeStep() {
  const { t } = useTranslation();
  const { chooseProposalType } = useCreateProposalContext();
  const proposaCategories = useProposalCategories();

  const {
    state: { theme },
  } = useAuthContext();

  const onChooseType = (tp: IBaseCategory) => {
    if (!tp.has_perm) return;
    chooseProposalType(tp);
  };

  return (
    <Container>
      <CenterBox>
        <StepTitle>{t('Proposal.ChooseType')}</StepTitle>
        <TypeBox>
          {proposaCategories.map((tp, index) => (
            <TypeLi key={index} className={tp.has_perm ? '' : 'noAuth'}>
              <span>{tp.name}</span>
              <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
              <TemplateBox>
                <li onClick={() => onChooseType(tp)}>
                  <span>新建提案（常规）</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
                <li className="noAuth">
                  <span>新建提案（常规）</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
              </TemplateBox>
            </TypeLi>
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
  width: 548px;
  padding: 48px 32px;
  background-color: var(--bs-box-background);
  border-radius: 16px;
  text-align: center;
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
`;

const StepTitle = styled.div`
  font-family: Poppins-Medium;
  font-size: 24px;
`;

const TypeBox = styled.ul`
  .noAuth {
    background: rgba(82, 0, 255, 0.08);
    color: var(--bs-body-color);
    cursor: not-allowed;
  }
`;
const TypeLi = styled.li`
  border: 1px solid var(--proposal-border);
  font-size: 14px;
  margin: 10px auto 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  position: relative;
  &:first-child {
    margin-top: 24px;
  }
  &:hover ul {
    display: block;
  }
`;

const TemplateBox = styled.ul`
  display: none;
  position: absolute;
  left: 100%;
  width: 200px;
  top: 0;
  border-radius: 8px;
  padding-block: 4px;
  background-color: var(--bs-box-background);
  border: 1px solid var(--proposal-border);
  overflow: hidden;

  li {
    display: flex;
    justify-content: space-between;
    padding: 5px 16px;
  }
`;
