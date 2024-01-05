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

const Box = styled.ul`
  position: relative;
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
  padding-right: ${(props) => (props.showRht === 'true' ? '372px' : '0')};
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

  width: ${(props) => (props.showRht === 'true' ? 'calc(100% - 410px)' : '100%')};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  box-sizing: border-box;
`;

const InputBox = styled.div`
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

const TagBox = styled.div`
  padding: 0 16px;
  border-radius: 4px;
  background: var(--bs-box--background);
  border: 1px solid rgba(217, 217, 217, 0.5);
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
`;
const TemplateTag = styled.div`
  color: #cc8f00;
  padding: 0 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #ffe071;
  background: #fff5d2;
  margin-left: 8px;
`;

const ComponnentBox = styled(TitleBox)`
  margin-bottom: 10px;
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

  const { changeStep } = useCreateProposalContext();

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
    let dataFormat: any = {};

    for (const dataKey in data) {
      dataFormat[dataKey] = {
        name: dataKey,
        data: data[dataKey],
      };
    }

    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    saveOrSubmitProposal({
      title,
      proposal_category_id: 41, // TODO hardcode for test
      content_blocks: list,
      components: dataFormat,
      template_id: template?.id,
      submit_to_metaforo: submitType === 'submit',
    })
      .then((r) => {
        navigate(`/proposal-v2/thread/${r.data.id}`);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
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
    setTimeout(allSubmit, 0);
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

  return (
    <Box>
      <FixedBox showRht={showRht.toString()}>
        <FlexInner>
          <BackBox onClick={() => setShowLeaveConfirm(true)}>
            <BackIconBox>
              <img src={BackIcon} alt="" />
            </BackIconBox>
            <span className="backTitle">{t('Proposal.CreateProposal')}</span>
          </BackBox>

          <BtnGroup>
            <Button className="save" onClick={handleSave}>
              {t('Proposal.SaveProposal')}
            </Button>
            <Button onClick={handleSubmit}>{t('Proposal.SubmitProposal')}</Button>
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
                <TitleBox>
                  <span>{t('Proposal.title')}</span>
                  <TagBox>三层提案 - P1</TagBox>
                  {templateTitle && <TemplateTag>{templateTitle}</TemplateTag>}
                </TitleBox>
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

                  <MdEditor
                    modelValue={item.content}
                    editorId={`block_${index}`}
                    onChange={(val) => handleText(val, index)}
                    theme={theme ? 'dark' : 'light'}
                  />

                  {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                </ItemBox>
              ))}
            </div>
          }
          ref={childRef}
          onSubmitData={handleFormSubmit}
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
