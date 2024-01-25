import styled from 'styled-components';
import { useState } from 'react';
import { useCreateProposalContext } from './store';
import { useTranslation } from 'react-i18next';
import useProposalCategories from 'hooks/useProposalCategories';
import { IBaseCategory, ITemplate } from 'type/proposalV2.type';
import ArrowRht from '../../../assets/Imgs/proposal/chevron-down.svg';
import ArrowRhtBlack from '../../../assets/Imgs/proposal/chevron-down-black.svg';
import ArrowGray from 'assets/Imgs/proposal/chevron-gray.svg';
import { useAuthContext } from '../../../providers/authProvider';
import BasicModal from 'components/modals/basicModal';
import SeeSelect from 'components/common/select';
import { PlainButton } from 'components/common/button';
import { Button } from 'react-bootstrap';

export default function ChooseTypeStep() {
  const { t } = useTranslation();
  const { chooseTemplate } = useCreateProposalContext();
  const proposaCategories = useProposalCategories();
  const [templateRulesVisible, setTemplateRulesVisible] = useState(false);
  const [closeoutVisible, setCloseoutVisible] = useState(false);
  const [selected, setSelected] = useState<{ tp: IBaseCategory; template: ITemplate }>();
  // TODO
  const [proposalList, setProposalList] = useState<any[]>([]);

  const {
    state: { theme },
  } = useAuthContext();

  const onChooseTemplate = (tp: IBaseCategory, template: ITemplate) => {
    if (template.id === 11111) {
      setSelected({ tp, template });
      setCloseoutVisible(true);
      return;
    }
    setTemplateRulesVisible(true);
    setSelected({ tp, template });
  };

  const handleCloseTemplateRulesModal = () => {
    if (selected?.template?.has_perm_to_use) {
      chooseTemplate(selected?.tp, selected?.template);
    }
    setTemplateRulesVisible(false);
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
                <li onClick={() => onChooseTemplate(tp, { id: 0, has_perm_to_use: true })}>
                  <span>新建提案（常规）</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
                <li onClick={() => onChooseTemplate(tp, { id: 0, vote_type: 1, has_perm_to_use: true })}>
                  <span>新建提案（多选项）</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
                <li onClick={() => onChooseTemplate(tp, { id: 11111, has_perm_to_use: true })}>
                  <span>提案结项</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
                <li className="noAuth" onClick={() => onChooseTemplate(tp, { id: 12, has_perm_to_use: false })}>
                  <span>新建提案（常规）</span>
                  <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                </li>
              </TemplateBox>
            </TypeLi>
          ))}
        </TypeBox>
      </CenterBox>
      {templateRulesVisible && (
        <TemplateRulesModal
          handleClose={handleCloseTemplateRulesModal}
          title={
            selected?.template?.has_perm_to_use
              ? t('Proposal.ProposalRulesIntro', { name: selected?.template?.name })
              : t('Proposal.NoPermisstionToPropose')
          }
        >
          {selected?.template?.rule_desc}
        </TemplateRulesModal>
      )}
      {closeoutVisible && (
        <CloseoutModal handleClose={() => setCloseoutVisible(false)} title={t('Proposal.ChooseCloseoutProposal')}>
          {proposalList.length > 0 ? (
            <>
              <div className="label">{t('Proposal.AssociatedProposalComponent')}</div>
              <SeeSelect />
              <CloseoutModalFooter>
                <PlainButton onClick={() => setCloseoutVisible(false)}>{t('general.cancel')}</PlainButton>
                <Button variant="primary" onClick={() => selected && chooseTemplate(selected?.tp, selected?.template)}>
                  {t('general.confirm')}
                </Button>
              </CloseoutModalFooter>
            </>
          ) : (
            <div className="empty">{t('Proposal.EmptyAssociatedProposal')}</div>
          )}
        </CloseoutModal>
      )}
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

const TemplateRulesModal = styled(BasicModal)``;

const CloseoutModal = styled(BasicModal)`
  width: 500px;
  padding: 40px 60px 60px;
  min-height: 280px;
  .label {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .empty {
    font-size: 14px;
    text-align: center;
  }
`;

const CloseoutModalFooter = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 24px;
  justify-content: center;
  align-items: center;
  button {
    width: 120px;
    &.btn {
      margin-right: 0;
    }
  }
`;
