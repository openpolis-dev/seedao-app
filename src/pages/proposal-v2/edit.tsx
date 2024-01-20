import styled from 'styled-components';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { IContentBlock, IProposal, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { Template } from '@taoist-labs/components';
import { MdEditor } from 'md-editor-rt';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { updateProposal, getProposalDetail } from 'requests/proposalV2';
import { Button } from 'react-bootstrap';
import getConfig from '../../utils/envCofnig';
import requests from '../../requests';
import BackIcon from '../../assets/Imgs/back.svg';
import useToast, { ToastType } from 'hooks/useToast';
import useProposalCategories from 'hooks/useProposalCategories';
import PlusImg from '../../assets/Imgs/light/plus.svg';
import MinusImg from '../../assets/Imgs/light/minus.svg';

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
  const proposalCategories = useProposalCategories();

  const [data, setData] = useState<IProposal>();
  const [contentBlocks, setContentBlocks] = useState<IContentBlock[]>([]);
  const [title, setTitle] = useState('');
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();
  const [token, setToken] = useState('');
  const [showRht, setShowRht] = useState(false);

  const [dataSource, setDataSource] = useState();
  const childRef = useRef(null);

  const { showToast } = useToast();

  const [voteList, setVoteList] = useState([
    {
      id: 1,
      value: 'test001',
    },
    {
      id: 2,
      value: 'test002',
    },
    {
      id: 3,
      value: 'test003',
    },
    {
      id: 4,
      value: 'test004',
    },
  ]);

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
          setShowRht(!res.data?.is_based_on_template);
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
    if ([ProposalState.PendingSubmit, ProposalState.Rejected, ProposalState.Withdrawn].includes(data.state)) {
      return;
    }
    navigate('/proposal');
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

    let dataFormat: any = {};

    for (const dataKey in submitData) {
      dataFormat[dataKey] = {
        name: dataKey,
        data: submitData[dataKey],
      };
    }

    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    updateProposal(Number(data.id), {
      title,
      proposal_category_id: data.proposal_category_id,
      content_blocks: contentBlocks,
      components: dataFormat,
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
  };

  const handleSaveDraft = (data: any) => {
    console.error({
      ...data,
    });
    handleFormSubmit(data);
  };
  const saveAllDraft = () => {
    (childRef.current as any).saveForm();
  };

  const handleSave = () => {
    setSubmitType('save');
    setTimeout(saveAllDraft, 0);
  };
  const handleSubmit = () => {
    setSubmitType('submit');
    setTimeout(allSubmit, 0);
  };

  const removeVote = (index: number) => {
    const arr = [...voteList];
    arr.splice(index, 1);
    setVoteList(arr);
  };

  const handleAdd = () => {
    const arr = [...voteList];
    arr.push({
      id: 10,
      value: '',
    });
    setVoteList(arr);
  };

  const handleVoteInput = (e: ChangeEvent, index: number) => {
    const arr = [...voteList];
    arr[index].value = (e.target as HTMLInputElement).value;
    setVoteList(arr);
  };

  const categoryName = data?.proposal_category_id
    ? proposalCategories.find((item) => item.id === data?.proposal_category_id)?.name
    : '';

  const submitDisabled = !title || !title.trim() || contentBlocks.some((item) => !item.content);

  return (
    <Page>
      {/*<BackerNav title={t('Proposal.EditProposalNav')} to={'/proposal-v2'} onClick={() => navigate(-1)} />*/}

      <FixedBox showRht={showRht?.toString()}>
        <FlexInner>
          <BackBox onClick={() => navigate(-1)}>
            <BackIconBox>
              <img src={BackIcon} alt="" />
            </BackIconBox>
            <span className="backTitle">{t('Proposal.EditProposal')}</span>
          </BackBox>

          <BtnGroup>
            {data?.state === ProposalState.PendingSubmit && (
              <Button className="save" onClick={handleSave} disabled={!title || !title.trim()}>
                {t('Proposal.SaveProposal')}
              </Button>
            )}
            <Button onClick={handleSubmit} disabled={submitDisabled}>
              {t('Proposal.SubmitProposal')}
            </Button>
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
                  {categoryName && <TagBox>{categoryName}</TagBox>}
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
                    toolbarsExclude={['github', 'save']}
                    theme={theme ? 'dark' : 'light'}
                    modelValue={item.content}
                    editorId={`block_${index}`}
                    onChange={(val) => handleText(val, index)}
                  />

                  {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                </ItemBox>
              ))}

              <ItemBox>
                <TitleBox>投票选项</TitleBox>
                <VoteBox>
                  {voteList.map((item, index) => (
                    <li>
                      <input type="text" value={item.value} onChange={(e) => handleVoteInput(e, index)} />
                      {voteList.length - 1 === index && (
                        <span onClick={() => handleAdd()}>
                          <img src={PlusImg} alt="" />
                        </span>
                      )}

                      {!!(voteList.length - 1) && (
                        <span onClick={() => removeVote(index)}>
                          <img src={MinusImg} alt="" />
                        </span>
                      )}
                    </li>
                  ))}
                </VoteBox>
              </ItemBox>
            </div>
          }
          ref={childRef}
          onSubmitData={handleFormSubmit}
          onSaveData={handleSaveDraft}
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

const VoteBox = styled.ul`
  padding: 0 32px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    input {
      flex-grow: 1;
      border: 1px solid var(--proposal-border);
      background: transparent;
      height: 40px;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 0 16px;
    }
    span {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid var(--proposal-border);
      cursor: pointer;
    }
  }
`;
