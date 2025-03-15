import styled from 'styled-components';
import { Template, Preview } from '@taoist-labs/components';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import { saveOrSubmitProposal, UploadPictures } from 'requests/proposalV2';
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
import PlusImg from 'assets/Imgs/light/plus.svg';
import MinusImg from 'assets/Imgs/light/minus.svg';
import { getProjectById } from '../../../requests/project';
import useQuerySNS from "../../../hooks/useQuerySNS";

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

const TipsBox = styled.div`
  padding: 10px 32px;
  font-size: 12px;
  opacity: 0.6;
`;

const AfterBox = styled.div``;

const WaringBox = styled.div`
  padding: 20px 0 0 30px;
  color: var(--bs-primary);
`;

export default function CreateStep({ onClick }: any) {
  const BASE_URL = getConfig().REACT_APP_BASE_ENDPOINT;
  const API_VERSION = process.env.REACT_APP_API_VERSION;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const childRef = useRef(null);
  const [title, setTitle] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [beforeList, setBeforeList] = useState<any[]>([]);
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();
  const [voteType, setVoteType] = useState<number>(0);

  const { template, extraData } = useCreateProposalContext();
  const [components, setComponents] = useState<any[]>([]);

  const [showRht, setShowRht] = useState(true);

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showType, setShowType] = useState('new');
  const [token, setToken] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [componentName, setComponentName] = useState('');
  const [holder, setHolder] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [previewTitle, setPreviewTitle] = useState('');
  const [initList, setInitList] = useState<any[]>([]);
  const [tips, setTips] = useState('');
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showErrorTips, setShowErrorTips] = useState(false);

  const [voteList, setVoteList] = useState(['']);

  const { changeStep, proposalType } = useCreateProposalContext();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<any>(null);

  const { getMultiSNS } = useQuerySNS();

  const {
    state: { theme, tokenData },
    dispatch,
  } = useAuthContext();

  const { checkMetaforoLogin } = useCheckMetaforoLogin();
  const [isInstantVoteAlertVisible, setIsInstantVoteAlertVisible] = useState(false);

  useEffect(() => {
    if (!template || !tokenData) return;

    setToken(tokenData.token);

    let { vote_type } = template;
    setVoteType(vote_type || 0);

    if (template.id) {
      setShowType('template');
      setShowRht(false);
      const { schema, components } = template;
      const arr = JSON.parse(schema!);

      const previewArr = arr.filter((i: any) => i.type === 'preview');
      if (previewArr?.length && extraData?.id) {
        setPreviewTitle(previewArr[0]?.title);

        getPreview();

        getComponentsList();
      }

      const componentsIndex = arr.findIndex((i: any) => i.type === 'components');

      const beforeComponents = arr.filter(
        (item: any) => item.type !== 'components' && arr.indexOf(item) < componentsIndex && item.type !== 'preview',
      );
      let componentsList = arr.filter((item: any) => item.type === 'components') || [];
      const afterComponents = arr.filter(
        (item: any) => item.type !== 'components' && arr.indexOf(item) > componentsIndex && item.type !== 'preview',
      );

      beforeComponents.forEach((item: any) => {
        item.content = `<!-- ${item.hint} -->`;
      });

      afterComponents.forEach((item: any) => {
        item.content = `<!-- ${item.hint} -->`;
      });

      if (!arr[componentsIndex]?.name && arr[componentsIndex]?.title && !components?.length) {
        setShowType('new');
        setShowRht(true);
        setComponentName(arr[componentsIndex]?.title);
        getComponentList();
      }

      setBeforeList(beforeComponents ?? []);
      setList(afterComponents ?? []);
      setHolder(componentsList);

      setComponentName(componentsList[0]?.title);
      setTips(componentsList[0]?.content);

      // setList(arr ?? []);
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
          title: '背景',
          content: '',
        },
        {
          title: '内容',
          content: '',
        },
        {
          title: '备注',
          content: '',
        },
      ]);
      getComponentList();
      setShowRht(true);
    }
  }, [template, tokenData]);

  const getPreview = async () => {
    if (!extraData) return;
    try{
      const res = await requests.proposalV2.getProposalDetail(extraData?.id, 0);



      let titleComponents = {
        component_id: 16,
        name: 'relate',
        schema: '',
        data: {
          relate: extraData?.name,
          proposal_id: extraData?.id,
        },
      };
      const comStr = res.data.components || [];
      comStr.map((item: any) => {
        if (typeof item.data === 'string') {
          item.data = JSON.parse(item.data);
        }
        return item;
      });
      comStr.unshift(titleComponents);

      const { associated_project_budgets: budgets } = res.data;


      let total: string[] = [];
      let ratio: string[] = [];
      let paid: string[] = [];
      let remainAmount: string[] = [];
      let prepayTotal: string[] = [];
      let prepayRemain: string[] = [];
      let canUse: string[] = [];

      let data: any = {};

      budgets?.map((item: any) => {
        total.push(`${item.total_amount} ${item.asset_name}`);
        ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
        paid.push(`${item.used_advance_amount} ${item.asset_name}`);
        remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
        prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
        prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
        let cU = Number(item.total_amount) - Number(item.used_advance_amount);
        canUse.push(`${cU} ${item.asset_name}`);
      });

      data.total = total.join(' , ');
      data.ratio = ratio.join(' , ');
      data.paid = paid.join(' , ');
      data.remainAmount = remainAmount.join(' , ');
      data.prepayTotal = prepayTotal.join(' , ');
      data.prepayRemain = prepayRemain.join(' , ');
      data.canUse = canUse.join(',');

      setDetail(data);

      setPreview(comStr ?? []);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };

  const getComponentsList = async () => {
    // NOTE: getProposalDetail may use more time, so not show loading here
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposalV2.getComponents();
      let components = resp.data;

      components?.map((item: any) => {
        if (typeof item.schema === 'string') {
          item.schema = JSON.parse(item.schema);
        }
        return item;
      });

      setInitList(resp.data);
    } catch (error:any) {
      logError('getAllProposals failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);

    } finally {
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

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
    } catch (error:any) {
      logError('getAllProposals failed', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const ToSubmit = async (data: any) => {
    if (!proposalType) {
      return;
    }

    setLoading(true);
    // let dataFormat: any = {};
    //
    // for (const dataKey in data) {
    //   dataFormat[dataKey] = {
    //     name: dataKey,
    //     data: data[dataKey],
    //   };
    // }



    const canSubmit = await checkMetaforoLogin();
    if (canSubmit) {
      let holderNew: any[] = [];
      if (holder.length) {
        holderNew = [...holder];
        holderNew[0].name = JSON.stringify(holder[0]?.name);
      }
      let previewArr = [
        {
          title: previewTitle,
          type: 'preview',
          content: JSON.stringify(preview),
        },
      ];
      let arr = [...previewArr, ...beforeList, ...holderNew, ...list];

      dispatch({ type: AppActionType.SET_LOADING, payload: true });

      saveOrSubmitProposal({
        title,
        proposal_category_id: proposalType?.category_id,
        vote_type: voteType,
        vote_options: voteType === 99 || voteType === 98 ? voteList : null,
        is_multiple_vote:template!.multiple_vote_type === "multiple",
        content_blocks: arr,
        components: data,
        template_id: template?.id,
        create_project_proposal_id: extraData?.id,
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
          if((error?.data?.msg || error?.code || error).indexOf("component data validation error") > -1 || (error?.data?.msg || error?.code || error).indexOf("invalid address")>-1 ) {
            showToast(t('Proposal.invalidAddress'), ToastType.Danger);
          }else{
            showToast(error?.data?.msg || error?.code || error, ToastType.Danger);
          }

        })
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    }
  };

  const handleFormSubmit = async (success: boolean, data: any) => {
  let checkEth = false;

    for (let i = 0; i < data?.length; i++) {
      let item = data[i];
      if(item?.data?.budgetList){
        for (let j = 0; j < item?.data?.budgetList?.length ; j++) {
          let inner = item?.data?.budgetList[j];

          if(inner?.typeTest?.name === "ETH" || inner?.assetInfo?.name === "ETH") {
            checkEth= true;
            break;
          }
        }
      }

    }

    if(checkEth ){
      setLoading(false);
      showToast(t('Msg.SelectAssetTypeError'), ToastType.Danger);
      return;
    }

    if (!success) {
      setLoading(false);
      setIsInstantVoteAlertVisible(false);
      return;
    }



    let motivationArr = template?.components?.filter((item) => item.name === "motivation") || [];

      if ((template?.name === 'P2提案结项' || template?.name === 'P3提案结项' ) && motivationArr?.length > 0) {

        if(!data?.length){
          setLoading(false);
          setIsInstantVoteAlertVisible(false);
          showToast(t('Msg.motivationError'), ToastType.Danger);
          return;
        }
        const motivationData = data.filter((item: any) => item.name === "motivation") || [];
        const addrArr:string[] = []
        motivationData[0]?.data?.budgetList.map((item: any) => {
          addrArr.push(item.address)
        })

    }




    let budgetArr = template?.components?.filter((item) => item.name === 'budget') || [];
    if ((template?.name === 'P2提案立项' && budgetArr?.length > 0) ||(template?.name === 'P3提案立项' && budgetArr?.length > 0)) {
      let err = false;

      const budgetData = data.filter((item: any) => item.name === 'budget') || [];
      if (budgetData?.length) {
        budgetData[0]?.data?.budgetList.map((item: any) => {

          if (item?.typeTest?.name === 'USDC') {
            if (Number(item.amount) > 1000) {
              err = true;
            }
          } else if (item?.typeTest?.name === 'SCR') {
            if (Number(item.amount) > 50000) {
              err = true;
            }
          }
        });
      }
      setShowErrorTips(err);
      if (err) return;
    }

    setResult(data);
    if (template?.is_instant_vote) {
      setIsInstantVoteAlertVisible(true);
    } else {
      ToSubmit(data);
    }
  };

  const handleSaveDraft = (data: any) => {
    console.log({
      ...data,
    });
    ToSubmit(data);
  };

  const saveAllDraft = () => {
    (childRef.current as any).saveForm();
  };

  const handleText = (value: any, index: number, type: string) => {
    if (type === 'before') {
      let arr = [...beforeList];
      arr[index].content = value;
      setBeforeList([...arr]);
    } else {
      let arr = [...list];
      arr[index].content = value;
      setList([...arr]);
    }
  };

  const allSubmit = () => {
    (childRef.current as any).submitForm();
  };

  const handleSave = () => {
    setSubmitType('save');
    setTimeout(saveAllDraft, 0);
  };

  const handleConfirmSubmit = () => {
    setSubmitType('submit');
    setTimeout(allSubmit, 0);
  };

  const closeIsInstantVoteAlert = () => {
    setIsInstantVoteAlertVisible(false);
    setSubmitType(undefined);
  };

  const handleBack = () => {
    setShowLeaveConfirm(false);
    changeStep(1);
  };

  const removeVote = (index: number) => {
    const arr = [...voteList];
    arr.splice(index, 1);
    setVoteList(arr);
  };

  const handleAdd = () => {
    const arr = [...voteList];
    arr.push('');
    setVoteList(arr);
  };

  const handleVoteInput = (e: ChangeEvent, index: number) => {
    const arr = [...voteList];
    arr[index] = (e.target as HTMLInputElement).value;
    setVoteList(arr);
  };

  const uploadPic = async (files: any[], callback: any) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const urlObjArr = await UploadPictures(files[0]);
      callback([urlObjArr]);
    } catch (error:any) {
      console.error('uploadPic', error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const handleErrorClose = () => {
    setShowErrorTips(false);
  };

  const EmptyArray = voteList.filter((item) => item === '');

  const submitDisabled =
    !title ||
    !title.trim() ||
    beforeList.some((item) => !item.content || !/^<!--.*-->(.|\n)+$|^(?!(<!--.*?-->))[\s\S]+$/.test(item.content)) ||
    list.some((item) => !item.content || !/^<!--.*-->(.|\n)+$|^(?!(<!--.*?-->))[\s\S]+$/.test(item.content)) ||
    ((voteType === 99 || voteType === 98) && !!EmptyArray?.length);

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
              <CategoryTag>{proposalType?.category_name}</CategoryTag>
              {templateTitle && showType !== 'new' && <TemplateTag>{templateTitle}</TemplateTag>}
            </TagsBox>
          </NavLeft>
          <BtnGroup>
            <Button className="save" onClick={handleSave} disabled={!title || !title.trim()}>
              {t('Proposal.SaveProposal')}
            </Button>
            <BtnFlex onClick={handleConfirmSubmit} disabled={submitDisabled || loading}>
              {t('Proposal.SubmitProposal')}{' '}
              {loading && (
                <LoadingBox>
                  <div className="loader" />
                </LoadingBox>
              )}
            </BtnFlex>
          </BtnGroup>
        </FlexInner>
      </FixedBox>

      <BoxBg showRht={showRht.toString()}>
        <Template
          DataSource={null}
          operate={showType}
          language={i18n.language}
          showRight={showRht}
          initialItems={components}
          theme={theme}
          rpc={getConfig().NETWORK.rpcs[0]}
          baseUrl={BASE_URL}
          version={API_VERSION}
          token={token}
          movitationSum={detail?.canUse}
          BeforeComponent={
            <>
              <ItemBox>
                <TitleBox>{t('Proposal.title')}</TitleBox>
                <InputBox>
                  <input type="text" value={title} onChange={handleInput} />
                </InputBox>
                <WaringBox>{t('Proposal.proposalWarnings')}</WaringBox>
              </ItemBox>

              {!!preview.length && (
                <>
                  <ItemBox className="preview">
                    <TitleBox>{previewTitle}</TitleBox>
                  </ItemBox>
                  <Preview DataSource={preview} language={i18n.language} rpc={getConfig().NETWORK.rpcs[0]} initialItems={initList} theme={theme} />
                </>
              )}

              {!!beforeList?.length &&
                beforeList.map((item, index: number) => (
                  <ItemBox key={`before_${index}`}>
                    {!!item.title && <TitleBox>{item.title}</TitleBox>}
                    <InputBox>
                      <MdEditor
                        key={`before_${index}_editor`}
                        toolbarsExclude={['github', 'save']}
                        modelValue={item.content}
                        editorId={`before_${index}_editor`}
                        onUploadImg={(files, callBack) => uploadPic(files, callBack)}
                        onChange={(val) => handleText(val, index, 'before')}
                        theme={theme ? 'dark' : 'light'}
                        placeholder={item.hint}
                      />
                    </InputBox>

                    {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                  </ItemBox>
                ))}
              {!!componentName?.length && (
                <>
                  <ComponnentBox>
                    <span>{componentName || t('Proposal.proposalComponents')}</span>
                  </ComponnentBox>
                  {!!tips && <TipsBox>{tips}</TipsBox>}
                </>
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
            <AfterBox>
              {!!list?.length &&
                list.map((item, index: number) => (
                  <ItemBox key={`block_${index}`}>
                    {!!item.title && <TitleBox>{item.title}</TitleBox>}
                    <InputBox>
                      <MdEditor
                        toolbarsExclude={['github', 'save']}
                        modelValue={item.content}
                        editorId={`block_${index}`}
                        onChange={(val) => handleText(val, index, 'after')}
                        theme={theme ? 'dark' : 'light'}
                        onUploadImg={(files, callBack) => uploadPic(files, callBack)}
                        placeholder={item.hint}
                      />
                    </InputBox>

                    {/*<MarkdownEditor value={item.content} onChange={(val)=>handleText(val,index)} />*/}
                  </ItemBox>
                ))}
              {(voteType === 99 || voteType === 98) && (
                <ItemBox>
                  <TitleBox>投票选项</TitleBox>
                  <VoteBox>
                    {voteList.map((item, index) => (
                      <li key={`vote_${index}`}>
                        <input type="text" value={item} onChange={(e) => handleVoteInput(e, index)} />
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
            </AfterBox>
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

      {showErrorTips && (
        <ConfirmModal
          title=""
          msg={template?.name === 'P2提案立项' ? t('Proposal.p2Tips'): t('Proposal.p3Tips') }
          onConfirm={() => handleErrorClose()}
          onClose={handleErrorClose}
        />
      )}
      {isInstantVoteAlertVisible && (
        <ConfirmModal
          title=""
          msg={t('Proposal.SubmitConfirmTip')}
          onConfirm={() => ToSubmit(result)}
          onClose={closeIsInstantVoteAlert}
        />
      )}
    </Box>
  );
}

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

const BtnFlex = styled(Button)`
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 5px;
  line-height: 26px;
`;
const LoadingBox = styled.div`
  /* HTML: <div class="loader"></div> */
  margin-top: 2px;
  .loader {
    width: 15px;
    padding: 3px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #fff;

    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
  }
  @keyframes l3 {
    to {
      transform: rotate(1turn);
    }
  }
`;
