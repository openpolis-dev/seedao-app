import styled from 'styled-components';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { IContentBlock, IProposal, ProposalState, Poll } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { Preview, Template } from '@taoist-labs/components';
import { MdEditor, MdPreview } from 'md-editor-rt';
import useCheckMetaforoLogin from 'hooks/useMetaforoLogin';
import { updateProposal, getProposalDetail, UploadPictures } from 'requests/proposalV2';
import { Button } from 'react-bootstrap';
import getConfig from '../../utils/envCofnig';
import requests from '../../requests';
import BackIcon from '../../assets/Imgs/back.svg';
import useToast, { ToastType } from 'hooks/useToast';
import useProposalCategories from 'hooks/useProposalCategories';
import PlusImg from '../../assets/Imgs/light/plus.svg';
import MinusImg from '../../assets/Imgs/light/minus.svg';
import ConfirmModal from '../../components/modals/confirmModal';
import dayjs from "dayjs";

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
  const [voteType, setVoteType] = useState<number | undefined>(0);
  const [beforeList, setBeforeList] = useState<any[]>([]);
  const [componentName, setComponentName] = useState('');
  const [holder, setHolder] = useState<any[]>([]);

  const [dataSource, setDataSource] = useState();
  const childRef = useRef(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewOrg, setPreviewOrg] = useState<any[]>([]);
  const [pid, setPid] = useState('');
  const [showErrorTips, setShowErrorTips] = useState(false);
  const { showToast } = useToast();
  const [voteList, setVoteList] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);

  const [initList, setInitList] = useState<any[]>([]);

  useEffect(() => {
    if (state) {
      setData(state);
      // setVoteList((state?.votes as any)?.options ?? []);
      setVoteList(state?.os_vote_options ?? []);

      let total: string[] = [];
      let ratio: string[] = [];
      let paid: string[] = [];
      let remainAmount: string[] = [];
      let prepayTotal: string[] = [];
      let prepayRemain: string[] = [];

      let data: any = {};

      state.associated_project_budgets?.map((item: any) => {
        total.push(`${item.total_amount} ${item.asset_name}`);
        ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
        paid.push(`${item.used_advance_amount} ${item.asset_name}`);
        remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
        prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
        prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
      });

      data.total = total.join(',');
      data.ratio = ratio.join(',');
      data.paid = paid.join(',');
      data.remainAmount = remainAmount.join(',');
      data.prepayTotal = prepayTotal.join(',');
      data.prepayRemain = prepayRemain.join(',');

      setDetail(data);

      setDataSource(state?.components ?? []);
      // setShowRht(!state?.is_based_on_custom_template);
      setVoteType(state?.vote_type);
      setShowRht(state?.is_based_on_custom_template);
    } else {
      const getDetail = async () => {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
          const res = await getProposalDetail(Number(id));
          setData(res.data);
          let total: string[] = [];
          let ratio: string[] = [];
          let paid: string[] = [];
          let remainAmount: string[] = [];
          let prepayTotal: string[] = [];
          let prepayRemain: string[] = [];
          let canUse: string[] = [];

          let data: any = {};

          res.data.associated_project_budgets?.map((item: any) => {
            total.push(`${item.total_amount} ${item.asset_name}`);
            ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
            paid.push(`${item.used_advance_amount} ${item.asset_name}`);
            remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
            prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
            prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);

            let cU = Number(item.total_amount) - Number(item.used_advance_amount);
            canUse.push(`${cU} ${item.asset_name}`);
          });

          data.total = total.join(',');
          data.ratio = ratio.join(',');
          data.paid = paid.join(',');
          data.remainAmount = remainAmount.join(',');
          data.prepayTotal = prepayTotal.join(',');
          data.prepayRemain = prepayRemain.join(',');
          data.canUse = canUse.join(',');

          setDetail(data);

          setVoteList((res.data as any)?.os_vote_options ?? []);
          setVoteType(res.data?.vote_type);
          setDataSource(res.data?.components ?? []);
          setShowRht(!res.data?.is_based_on_custom_template);
        } catch (error) {
          logError('get proposal detail error:', error);
        } finally {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        }
      };
    }
  }, [id, state]);

  useEffect(() => {

    if(holder.length){
      let arr = JSON.parse((holder[0] as any)?.name)
      if(typeof arr == "string"){
        arr = JSON.parse(arr);
      }
      if(!arr.length){
        setInitList([])
        return;
      }
      let newArr: any[] = []
      arr?.map((com:string)=>{
        const hasArr = components.filter((item)=> item.schema.type === com || item.name == com )
        newArr = [...newArr,...hasArr]
      })
      setInitList([...newArr])

    }else{
      setInitList([])
    }


  }, [holder,components]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);

      const arr = data.content_blocks;
      const componentsIndex = arr.findIndex((i: any) => i.type === 'components');

      const beforeComponents = arr.filter(
        (item: any) => item.type !== 'components' && item.type !== 'preview' && arr.indexOf(item) < componentsIndex,
      );

      let componentsList = arr.filter((item: any) => item.type === 'components') || [];
      const afterComponents = arr.filter(
        (item: any) => item.type !== 'components' && item.type !== 'preview' && arr.indexOf(item) > componentsIndex,
      );


      const preview = arr.filter((i: any) => i.type === 'preview');
      setPreviewOrg(preview);
      const preArr = JSON.parse(preview[0].content);


      setPreview(preArr);
      setPreviewTitle(preview[0].title);

      setComponentName(componentsList[0]?.title);
      setBeforeList(beforeComponents ?? []);
      setHolder(componentsList);

      const propArr = preArr.filter((item: any) => item.name === 'relate');

      if (propArr?.length) {
        setPid(propArr[0]?.data?.proposal_id);
      }

      setContentBlocks(afterComponents);

      // setContentBlocks(data.content_blocks);
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
  const handleTextBefore = (value: any, index: number) => {
    let arr = [...beforeList];
    arr[index].content = value;
    setBeforeList([...arr]);
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

  const handleFormSubmit = async (success: boolean, submitData: any) => {
    if (!data || !success) {
      return;
    }
    const newTime = new Date().valueOf();
    const publicity_ts = (data?.publicity_ts ?? 0) * 1000

    if( publicity_ts && publicity_ts < newTime && submitType === 'submit'){
      showToast(t("Proposal.reviewTips"), ToastType.Danger, {
        hideProgressBar: true,
      });
      return;
    }


    if (((data as any)?.template_name === 'P2提案结项' || (data as any)?.template_name === 'P3提案结项' )) {

      if(!submitData.length && submitType === 'submit'){
        showToast(t('Msg.motivationError'), ToastType.Danger);
        return;
      }

    }


    let budgetArr = data?.components?.filter((item: any) => item.name === 'budget') || [];
    if (data?.template_name === 'P2提案立项' && budgetArr?.length > 0) {
      let err = false;

      const budgetData = submitData.filter((item: any) => item.name === 'budget') || [];
      if (budgetData.length) {
        budgetData[0].data.budgetList.map((item: any) => {
          if (item.typeTest.name === 'USDC') {
            if (Number(item.amount) > 1000) {
              err = true;
            }
          } else if (item.typeTest.name === 'SCR') {
            if (Number(item.amount) > 50000) {
              err = true;
            }
          }
        });
      }
      setShowErrorTips(err);
      if (err) return;
    }

    // let dataFormat: any = {};
    //
    // for (const dataKey in submitData) {
    //   dataFormat[dataKey] = {
    //     name: dataKey,
    //     data: submitData[dataKey],
    //   };
    // }

    await checkMetaforoLogin();

    let holderNew = [...holder];


    if (holder?.length) {
      holderNew[0].name = JSON.stringify(holder[0]?.name);
    }

    let arr = [...previewOrg, ...beforeList, ...holderNew, ...contentBlocks];
    let newVoteList: string[] = [];
    if (voteType === 99 || voteType === 98) {
      voteList.map((item) => {
        newVoteList.push(item.label);
      });
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    updateProposal(Number(data!.id), {
      title,
      proposal_category_id: data!.proposal_category_id,
      content_blocks: arr,
      vote_type: voteType,
      vote_options: voteType === 99 || voteType === 98 ? newVoteList : null,
      components: submitData,
      create_project_proposal_id: pid ? pid : 0,
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
    handleFormSubmit(true, data);
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
    arr.push({ id: '', label: '', metaforo_id: 0 });
    setVoteList(arr);
  };

  const handleVoteInput = (e: ChangeEvent, index: number) => {
    const arr = [...voteList];
    arr[index].label = (e.target as HTMLInputElement).value;
    setVoteList(arr);
  };

  const handleErrorClose = () => {
    setShowErrorTips(false);
  };

  const uploadPic = async (files: any[], callback: any) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const urlObjArr = await UploadPictures(files[0]);
      callback([urlObjArr]);
    } catch (e) {
      console.error('uploadPic', e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const categoryName = data?.proposal_category_id
    ? proposalCategories?.find((item) => item.id === data?.proposal_category_id)?.name
    : '';

  // const submitDisabled = !title || !title.trim() || contentBlocks.some((item) => !item.content);
  const submitDisabled =
    !title ||
    !title.trim() ||
    beforeList.some((item) => !item.content || !/^<!--.*-->(.|\n)+$|^(?!(<!--.*?-->))[\s\S]+$/.test(item.content)) ||
    contentBlocks.some((item) => !item.content || !/^<!--.*-->(.|\n)+$|^(?!(<!--.*?-->))[\s\S]+$/.test(item.content));

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
        <TemplateBox>

          <Template
            DataSource={dataSource}
            operate="edit"
            initialItems={initList}
            language={i18n.language}
            showRight={showRht}
            theme={theme}
            rpc={getConfig().NETWORK.rpcs[0]}
            baseUrl={BASE_URL}
            version={API_VERSION}
            token={token}
            movitationSum={detail?.canUse}
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

                {!!preview?.length && (
                  <>
                    <ItemBox>
                      <TitleBox>{previewTitle}</TitleBox>
                      <div>
                        <Preview
                          DataSource={preview}
                          rpc={getConfig().NETWORK.rpcs[0]}
                          language={i18n.language}
                          initialItems={components}
                          theme={theme}
                        />
                      </div>
                    </ItemBox>
                  </>
                )}

                {!!beforeList?.length &&
                  beforeList?.map((item, index: number) => (
                    <ItemBox key={`block_${index}`}>
                      <TitleBox>{item.title}</TitleBox>

                      <MdEditor
                        toolbarsExclude={['github', 'save']}
                        theme={theme ? 'dark' : 'light'}
                        modelValue={item.content}
                        editorId={`block_${index}`}
                        onUploadImg={(files, callBack) => uploadPic(files, callBack)}
                        onChange={(val) => handleTextBefore(val, index)}
                      />

                      {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                    </ItemBox>
                  ))}
                {!!componentName?.length && (
                  <ComponnentBox>
                    <span>{componentName || t('Proposal.proposalComponents')}</span>
                  </ComponnentBox>
                )}
                {componentName === '激励申请表' && (
                  <DisplayBox>
                    <div className="titl">当前可申请资产: {detail?.remainAmount}</div>
                    <div className="content">
                      <dl>
                        <dt>项目预算</dt>
                        <dd> {detail?.total}</dd>
                      </dl>
                      <dl>
                        <dt>预付比例</dt>
                        <dd>{detail?.ratio}</dd>
                      </dl>
                      <dl>
                        <dt>总可预支</dt>
                        <dd> {detail?.prepayTotal}</dd>
                      </dl>
                      <dl>
                        <dt>当前已预支</dt>
                        <dd>{detail?.paid}</dd>
                      </dl>
                      <dl>
                        <dt>预算余额</dt>
                        <dd>{detail?.remainAmount}</dd>
                      </dl>
                      <dl>
                        <dt>可预支余额</dt>
                        <dd>{detail?.prepayRemain}</dd>
                      </dl>
                    </div>
                  </DisplayBox>
                )}
              </>
            }
            AfterComponent={
              <div>
                {!!contentBlocks?.length &&
                  contentBlocks?.map((item, index: number) => (
                    <ItemBox key={`block_${index}`}>
                      <TitleBox>{item.title}</TitleBox>

                      <MdEditor
                        toolbarsExclude={['github', 'save']}
                        theme={theme ? 'dark' : 'light'}
                        modelValue={item.content}
                        editorId={`block_${index}`}
                        onChange={(val) => handleText(val, index)}
                        onUploadImg={(files, callBack) => uploadPic(files, callBack)}
                      />

                      {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                    </ItemBox>
                  ))}

                {(voteType === 99 || voteType === 98) && data?.state === 'pending_submit' && (
                  <ItemBox>
                    <TitleBox>投票选项</TitleBox>
                    <VoteBox>
                      {voteList.map((item, index) => (
                        <li key={`vote_${index}`}>
                          <input type="text" value={item.label} onChange={(e) => handleVoteInput(e, index)} />
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
                )}
              </div>
            }
            ref={childRef}
            onSubmitData={handleFormSubmit}
            onSaveData={handleSaveDraft}
          />
        </TemplateBox>
        {showErrorTips && (
          <ConfirmModal
            title=""
            msg={t('Proposal.p2Tips')}
            onConfirm={() => handleErrorClose()}
            onClose={handleErrorClose}
          />
        )}
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

const DisplayBox = styled.div`
  background: var(--home-right);
  margin: 10px 30px;
  padding: 20px 20px 10px;
  border-radius: 10px;
  .titl {
    font-size: 16px;
    font-weight: 600;
    color: var(--bs-body-color_active);
    margin-bottom: 20px;
    text-transform: capitalize;
  }
  .content {
    font-size: 14px;
    color: var(--bs-body-color_active);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    text-transform: capitalize;
    dl {
      width: 33.333%;
      display: flex;

      align-items: center;
      margin-bottom: 10px;
      dt {
        margin-right: 20px;
        min-width: 70px;
        font-weight: normal;
      }
    }
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
  //height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  box-sizing: border-box;
`;

const VoteBox = styled.ul`
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

const TemplateBox = styled.div`
  .p32Width {
    padding: 0;
  }
`;
