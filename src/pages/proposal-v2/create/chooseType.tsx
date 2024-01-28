import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useCreateProposalContext } from './store';
import { useTranslation } from 'react-i18next';
import { ICategory, ITemplate } from 'type/proposalV2.type';
import ArrowRht from '../../../assets/Imgs/proposal/chevron-down.svg';
import ArrowRhtBlack from '../../../assets/Imgs/proposal/chevron-down-black.svg';
import ArrowGray from 'assets/Imgs/proposal/chevron-gray.svg';
import { useAuthContext } from '../../../providers/authProvider';
import BasicModal, { Iprops as IBasicModalProps } from 'components/modals/basicModal';
import SeeSelect from 'components/common/select';
import { PlainButton } from 'components/common/button';
import { Button, ModalFooter } from 'react-bootstrap';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';
import requests from '../../../requests';
import { getCloseProposal } from '../../../requests/proposalV2';

type ExtraType = { id: number; name: string };

interface ICloseOutSelectModalProps extends IBasicModalProps {
  id: number;
  handleConfirm: (extra: ExtraType) => void;
}

const CloseOutSelectModal = ({ id, handleConfirm, ...props }: ICloseOutSelectModalProps) => {
  const { t } = useTranslation();
  const [proposalList, setProposalList] = useState<any[]>([]);
  const [selectExtra, setSelectExtra] = useState<ExtraType>();

  useEffect(() => {
    console.log(id);
    if (!id) return;
    getSelectDetail(id);
  }, [id]);

  const getSelectDetail = async (id: any) => {
    const res = await requests.proposalV2.getCloseProposal(Number(id));
    setProposalList(res.data);
  };

  const onConfirm = () => {
    if (selectExtra) {
      handleConfirm(selectExtra);
    }
  };

  return (
    <CloseoutModal {...props}>
      {proposalList.length > 0 ? (
        <>
          <div className="label">{t('Proposal.AssociatedProposalComponent')}</div>
          <SeeSelect value={selectExtra} />
          <CloseoutModalFooter>
            <PlainButton onClick={props.h}>{t('general.cancel')}</PlainButton>
            <Button variant="primary" onClick={onConfirm}>
              {t('general.confirm')}
            </Button>
          </CloseoutModalFooter>
        </>
      ) : (
        <div className="empty">{t('Proposal.EmptyAssociatedProposal')}</div>
      )}
    </CloseoutModal>
  );
};

export default function ChooseTypeStep() {
  const {
    state: { categoryTemplates },
  } = useAuthContext();
  const { t } = useTranslation();
  const { chooseTemplate } = useCreateProposalContext();
  const [templateRulesVisible, setTemplateRulesVisible] = useState(false);
  const [closeoutVisibleId, setCloseoutVisibleId] = useState<number>();
  const [selected, setSelected] = useState<{ tp: ICategory; template: ITemplate }>();

  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const {
    state: { theme },
  } = useAuthContext();

  const onChooseTemplate = (tp: ICategory, template: ITemplate) => {
    if (template.id === 0) {
      chooseTemplate(tp, template);
      return;
    }

    setTemplateRulesVisible(true);
    setSelected({ tp, template });
  };

  const handleCloseTemplateRulesModal = () => {
    setTemplateRulesVisible(false);
    
  };

  const goToCreateNext = () => {
    handleCloseTemplateRulesModal();
    if (selected?.template?.has_perm_to_use) {
      if (selected?.template.is_closing_project) {
        setCloseoutVisibleId(selected.tp.category_id);
        return;
      }
      chooseTemplate(selected?.tp, selected?.template);
    }
  }

  return (
    <Container>
      <CenterBox>
        <StepTitle>{t('Proposal.ChooseType')}</StepTitle>
        <TypeBox>
          {categoryTemplates.map((tp, index) => (
            <TypeLi key={tp.category_id}>
              <span>{tp.category_name}</span>
              <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
              <TemplateBox>
                {canUseCityhall && (
                  <>
                    <li onClick={() => onChooseTemplate(tp, { id: 0, has_perm_to_use: canUseCityhall })}>
                      <span>{t('Proposal.CreateBlank')}</span>
                      <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                    </li>
                    {tp.category_id !== 50 && (
                      <li
                        onClick={() => onChooseTemplate(tp, { id: 0, vote_type: 99, has_perm_to_use: canUseCityhall })}
                      >
                        <span>{t('Proposal.CreateBlank_Multi')}</span>
                        <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                      </li>
                    )}
                  </>
                )}

                {tp.templates.map((template) => (
                  <li
                    onClick={() => onChooseTemplate(tp, template)}
                    key={template.id}
                    className={template.has_perm_to_use ? '' : 'noAuth'}
                  >
                    <span>{template.name}</span>
                    <img src={theme ? ArrowRhtBlack : ArrowRht} alt="" />
                  </li>
                ))}
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
          {selected?.template?.rule_description}
          {selected?.template?.has_perm_to_use && (
            <CardFooter>
              <Button variant="outline-primary" className="btnBtm" onClick={handleCloseTemplateRulesModal}>
                {t('general.cancel')}
              </Button>
              <Button onClick={goToCreateNext}> {t('Proposal.Create')}</Button>
            </CardFooter>
          )}
        </TemplateRulesModal>
      )}
      {!!closeoutVisibleId && (
        <CloseOutSelectModal
          id={closeoutVisibleId}
          handleClose={() => setCloseoutVisibleId(undefined)}
          title={t('Proposal.ChooseCloseoutProposal')}
          handleConfirm={(extra: ExtraType) => selected && chooseTemplate(selected?.tp, selected?.template, extra)}
        />
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
  min-width: 240px;
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
    white-space: nowrap;
  }
`;

const TemplateRulesModal = styled(BasicModal)`
  width: 500px;
`;

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

const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
  }
`;
