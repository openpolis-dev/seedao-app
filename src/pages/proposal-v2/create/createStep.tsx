import styled from 'styled-components';

import { Template } from '@seedao/components';
import DataSource from './json/datasource.json';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import { saveOrSubmitProposal } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import BackIcon from '../../../assets/Imgs/back.svg';
import ConfirmModal from 'components/modals/confirmModal';
import { useCreateProposalContext } from './store';
import requests from '../../../requests';
import getConfig from '../../../utils/envCofnig';
import useToast, { ToastType } from 'hooks/useToast';
import TemplateTag from 'components/proposalCom/templateTag';
import CategoryTag from 'components/proposalCom/categoryTag';

const Box = styled.ul`
  position: relative;
  .cm-scroller {
    background: var(--home-right);
  }
`;

const ItemBox = styled.div`
  margin-bottom: 20px;
`;

const TitleBox = styled.div`
  background: rgba(82, 0, 255, 0.08);
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const FixedBox = styled.div<{ showRht: string }>`
  background-color: var(--bs-box-background);
  position: sticky;
  margin: -24px 0 0 -32px;
  width: calc(100% + 64px);
  top: 0;
  height: 64px;
  z-index: 95;
  box-sizing: border-box;
  padding-right: ${(props) => (props.showRht === 'true' ? '340px' : '0')};
  box-shadow: var(--proposal-box-shadow);
  border-top: 1px solid var(--bs-border-color);
`;

const FlexInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 64px;
`;

const NavLeft = styled.div`
  display: flex;
  gap: 12px;
`;

const TagsBox = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const BackBox = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  .backTitle {
    color: var(--bs-body-color_active);
  }
`;

const BackIconBox = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(217, 217, 217, 0.5);
  background: var(--bs-box-background);
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  .btn {
    width: 100px;
    height: 40px;
    margin-left: 16px;
  }
  .save {
    background: transparent;
    border: 1px solid rgba(217, 217, 217, 0.5);
    color: var(--font-color-title);
  }
`;

const BoxBg = styled.div<{ showRht: string }>`
  background-color: var(--bs-box-background);
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  margin-top: 24px;
  border-radius: 8px;

  width: ${(props) => (props.showRht === 'true' ? 'calc(100% - 335px)' : '100%')};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
`;

const InputBox = styled.div`
  padding: 0 32px;
  input {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--bs-border-color);
    background: var(--bs-box--background);
    padding: 0 12px;
    box-sizing: border-box;
    &:hover,
    &:focus {
      border: 1px solid rgba(82, 0, 255, 0.5);
      outline: none;
    }
  }
`;

const ComponnentBox = styled(TitleBox)`
  margin-bottom: 10px;
  span {
    font-size: 16px;
  }
`;

export default function CreateStep({ onClick }: any) {
  const BASE_URL = getConfig().REACT_APP_BASE_ENDPOINT;
  const API_VERSION = process.env.REACT_APP_API_VERSION;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const childRef = useRef(null);
  const [title, setTitle] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();

  const { template } = useCreateProposalContext();
  const [components, setComponents] = useState<any[]>([]);

  const [showRht, setShowRht] = useState(true);

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showType, setShowType] = useState('new');
  const [token, setToken] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');

  const { changeStep, proposalType } = useCreateProposalContext();
  const { showToast } = useToast();

  const {
    state: { theme, tokenData },
    dispatch,
  } = useAuthContext();

  const { checkMetaforoLogin } = useCheckMetaforoLogin();

  useEffect(() => {
    if (!template || !tokenData) return;

    setToken(tokenData.token);
    if (template.id) {
      setShowType('template');
      setShowRht(false);
      const { schema, components } = template;
      const arr = JSON.parse(schema!);
      setList(arr ?? []);
      setTemplateTitle(template?.name ?? '');
      components?.map((item) => {
        if (typeof item.schema === 'string') {
          item.schema = JSON.parse(item.schema);
        }
        return item;
      });

      setComponents(components ? components : []);
    } else {
      setShowType('new');

      setList([
        {
          title: '提案背景',
          content: '',
        },
        {
          title: '提案内容',
          content: '',
        },
      ]);
      getComponentList();
      setShowRht(true);
    }
  }, [template, tokenData]);

  const handleInput = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setTitle(value);
  };

  const getComponentList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposalV2.getComponents();
      let components = resp.data;

      components?.map((item: any) => {
        if (typeof item.schema === 'string') {
          item.schema = JSON.parse(item.schema);
        }
        return item;
      });

      setComponents(components);
    } catch (error) {
      logError('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!proposalType) {
      return;
    }
    let dataFormat: any = {};

    for (const dataKey in data) {
      dataFormat[dataKey] = {
        name: dataKey,
        data: data[dataKey],
      };
    }
    const canSubmit = await checkMetaforoLogin();
    if (canSubmit) {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      saveOrSubmitProposal({
        title,
        proposal_category_id: proposalType?.id,
        content_blocks: list,
        components: dataFormat,
        template_id: template?.id,
        submit_to_metaforo: submitType === 'submit',
      })
        .then((r) => {
          showToast(
            submitType === 'submit' ? t('Msg.SubmitProposalSuccess') : t('Msg.SaveProposalSuccess'),
            ToastType.Success,
          );
          navigate(`/proposal/thread/${r.data.id}`);
        })
        .catch((error: any) => {
          logError('saveOrSubmitProposal failed', error);
          showToast(error?.data?.msg || error?.code || error, ToastType.Danger);
        })
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        });
    }
  };

  const handleSaveDraft = (data: any) => {
    console.log({
      ...data,
    });
    handleFormSubmit(data);
  };

  const saveAllDraft = () => {
    (childRef.current as any).saveForm();
  };

  const handleText = (value: any, index: number) => {
    let arr = [...list];
    arr[index].content = value;
    setList([...arr]);
  };

  const allSubmit = () => {
    (childRef.current as any).submitForm();
  };

  const handleSave = () => {
    setSubmitType('save');
    setTimeout(saveAllDraft, 0);
  };
  const handleSubmit = () => {
    // TODO: check content
    setSubmitType('submit');
    setTimeout(allSubmit, 0);
  };

  const handleBack = () => {
    setShowLeaveConfirm(false);
    changeStep(2);
  };

  const submitDisabled = !title || !title.trim() || list.some((item) => !item.content);

  return (
    <Box>
      <FixedBox showRht={showRht.toString()}>
        <FlexInner>
          <NavLeft>
            <BackBox onClick={() => setShowLeaveConfirm(true)}>
              <BackIconBox>
                <img src={BackIcon} alt="" />
              </BackIconBox>
              <span className="backTitle">{t('Proposal.CreateProposal')}</span>
            </BackBox>
            <TagsBox>
              <CategoryTag>{proposalType?.name}</CategoryTag>
              {templateTitle && <TemplateTag>{templateTitle}</TemplateTag>}
            </TagsBox>
          </NavLeft>
          <BtnGroup>
            <Button className="save" onClick={handleSave} disabled={!title || !title.trim()}>
              {t('Proposal.SaveProposal')}
            </Button>
            <Button onClick={handleSubmit} disabled={submitDisabled}>
              {t('Proposal.SubmitProposal')}
            </Button>
          </BtnGroup>
        </FlexInner>
      </FixedBox>

      <BoxBg showRht={showRht.toString()}>
        <Template
          DataSource={DataSource}
          operate={showType}
          language={i18n.language}
          showRight={showRht}
          initialItems={components}
          theme={theme}
          baseUrl={BASE_URL}
          version={API_VERSION}
          token={token}
          BeforeComponent={
            <>
              <ItemBox>
                <TitleBox>{t('Proposal.title')}</TitleBox>
                <InputBox>
                  <input type="text" value={title} onChange={handleInput} />
                </InputBox>
              </ItemBox>

              <ComponnentBox>
                <span>{t('Proposal.proposalComponents')}</span>
              </ComponnentBox>
            </>
          }
          AfterComponent={
            <div>
              {list.map((item, index: number) => (
                <ItemBox key={`block_${index}`}>
                  {!!item.title && <TitleBox>{item.title}</TitleBox>}
                  <InputBox>
                    <MdEditor
                      toolbarsExclude={['github', 'save']}
                      modelValue={item.content}
                      editorId={`block_${index}`}
                      onChange={(val) => handleText(val, index)}
                      theme={theme ? 'dark' : 'light'}
                    />
                  </InputBox>

                  {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                </ItemBox>
              ))}
            </div>
          }
          ref={childRef}
          onSubmitData={handleFormSubmit}
          onSaveData={handleSaveDraft}
        />
      </BoxBg>
      {showLeaveConfirm && (
        <ConfirmModal
          title=""
          msg={t('Proposal.ConfirmBackCreate')}
          onConfirm={handleBack}
          onClose={() => setShowLeaveConfirm(false)}
        />
      )}
    </Box>
  );
}
