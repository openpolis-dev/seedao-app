import styled from 'styled-components';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { IContentBlock, IProposal, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { Template } from '@seedao/components';
import { MdEditor } from 'md-editor-rt';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { updateProposal, getProposalDetail } from 'requests/proposalV2';
import { Button } from 'react-bootstrap';
import getConfig from '../../utils/envCofnig';
import requests from '../../requests';
import BackIcon from '../../assets/Imgs/back.svg';

export default function EditProposal() {
  const { t, i18n } = useTranslation();
  const BASE_URL = getConfig().REACT_APP_BASE_ENDPOINT;
  const API_VERSION = process.env.REACT_APP_API_VERSION;
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation(); // state is the proposal data if from thread page
  const [components, setComponents] = useState<any[]>([]);
  const {
    state: { theme, tokenData },
    dispatch,
  } = useAuthContext();

  const { checkMetaforoLogin } = useCheckMetaforoLogin();

  const [data, setData] = useState<IProposal>();
  const [contentBlocks, setContentBlocks] = useState<IContentBlock[]>([]);
  const [title, setTitle] = useState('');
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();
  const [token, setToken] = useState('');
  const [showRht, setShowRht] = useState(false);

  const [dataSource, setDataSource] = useState();
  const childRef = useRef(null);

  useEffect(() => {
    if (state) {
      setData(state);
      setDataSource(state?.components ?? []);
      setShowRht(!state?.is_based_on_template);
    } else {
      const getDetail = async () => {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
          const res = await getProposalDetail(Number(id));
          setData(res.data);
          setDataSource(res.data?.components ?? []);
        } catch (error) {
          logError('get proposal detail error:', error);
        } finally {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        }
      };
      getDetail();
    }
  }, [id, state]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContentBlocks(data.content_blocks);
    }
  }, [data]);

  useEffect(() => {
    getComponentList();
  }, []);

  const handleText = (value: any, index: number) => {
    let arr = [...contentBlocks];
    arr[index].content = value;
    setContentBlocks([...arr]);
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

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data?.state === ProposalState.PendingSubmit) {
      return;
    }
    if ([ProposalState.Draft, ProposalState.Approved, ProposalState.Rejected].includes(data.state)) {
      navigate('/proposal-v2');
    }

    // other state can not be edited
  }, [data]);

  useEffect(() => {
    if (!tokenData) return;
    setToken(tokenData.token);
  }, [tokenData]);

  const allSubmit = () => {
    (childRef.current as any).submitForm();
  };

  const handleFormSubmit = async (submitData: any) => {
    if (!data) {
      return;
    }
    console.log({
      title,
      proposal_category_id: data.proposal_category_id,
      content_blocks: contentBlocks,
      components: submitData,
      // only pending-submit proposal can be submitted, others can only be updated
      submit_to_metaforo: data.state === ProposalState.PendingSubmit && submitType === 'submit',
    });
    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    updateProposal(Number(data.id), {
      title,
      proposal_category_id: data.proposal_category_id,
      content_blocks: contentBlocks,
      components: submitData,
      // only pending-submit proposal can be submitted, others can only be updated
      submit_to_metaforo: data.state === ProposalState.PendingSubmit && submitType === 'submit',
    })
      .then((r) => {
        navigate(`/proposal-v2/thread/${r.data.id}`);
      })
      .finally(() => {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      });
  };

  const handleSave = () => {
    setSubmitType('save');
    setTimeout(allSubmit, 0);
  };
  const handleSubmit = () => {
    setSubmitType('submit');
    setTimeout(allSubmit, 0);
  };

  return (
    <Page>
      {/*<BackerNav title={t('Proposal.EditProposalNav')} to={'/proposal-v2'} onClick={() => navigate(-1)} />*/}

      <FixedBox showRht={showRht?.toString()}>
        <FlexInner>
          <BackBox onClick={() => navigate(-1)}>
            <BackIconBox>
              <img src={BackIcon} alt="" />
            </BackIconBox>
            <span className="backTitle">{t('Proposal.CreateProposal')}</span>
          </BackBox>

          <BtnGroup>
            {/*<Button className="save" onClick={handleSave}>*/}
            {/*  {t('Proposal.SaveProposal')}*/}
            {/*</Button>*/}
            {/*<Button onClick={handleSubmit}>{t('Proposal.SubmitProposal')}</Button>*/}

            {data?.state === ProposalState.PendingSubmit && (
              <Button onClick={handleSave}>{t('Proposal.SaveProposal')}</Button>
            )}
            <Button onClick={handleSubmit}>{t('Proposal.SubmitProposal')}</Button>
          </BtnGroup>
        </FlexInner>
      </FixedBox>
      <BoxBg showRht={showRht?.toString()}>
        <Template
          DataSource={dataSource}
          operate="edit"
          initialItems={components}
          language={i18n.language}
          showRight={showRht}
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
                  {/*<TemplateTag>公共项目</TemplateTag>*/}
                </TitleBox>
                <InputBox>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </InputBox>
              </ItemBox>
              <ComponnentBox>
                <span>{t('Proposal.proposalComponents')}</span>
              </ComponnentBox>
            </>
          }
          AfterComponent={
            <div>
              {contentBlocks?.map((item, index: number) => (
                <ItemBox key={`block_${index}`}>
                  <TitleBox>{item.title}</TitleBox>

                  <MdEditor
                    theme={theme ? 'dark' : 'light'}
                    modelValue={item.content}
                    editorId={`block_${index}`}
                    onChange={(val) => handleText(val, index)}
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
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
  color: var(--bs-body-color_active);
  .cm-scroller {
    background: var(--home-right);
  }
`;

const ItemBox = styled.div`
  margin-bottom: 20px;
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

const TitleBox = styled.div`
  background: rgba(82, 0, 255, 0.08);
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const ComponnentBox = styled(TitleBox)`
  margin-bottom: 10px;
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
