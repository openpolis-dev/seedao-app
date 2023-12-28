import styled from 'styled-components';
import BackerNav from 'components/common/backNav';
import { ContainerPadding } from 'assets/styles/global';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { IContentBlock, IProposal, ProposalState } from 'type/proposalV2.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { Template } from '@seedao/proposal';
import { MdEditor } from 'md-editor-rt';
import DataSource from './create/json/datasource.json';
import initialItems from './create/json/initialItem';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
import { saveOrSubmitProposal, getProposalDetail } from 'requests/proposalV2';
import { Button } from 'react-bootstrap';

export default function EditProposal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation(); // state is the proposal data if from thread page

  const { dispatch } = useAuthContext();
  const checkMetaforoLogin = useCheckMetaforoLogin();

  const [data, setData] = useState<IProposal>();
  const [contentBlocks, setContentBlocks] = useState<IContentBlock[]>([]);
  const [title, setTitle] = useState('');
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();

  const childRef = useRef(null);

  useEffect(() => {
    if (state) {
      setData(state);
    } else {
      const getDetail = async () => {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        try {
          const res = await getProposalDetail(Number(id));
          setData(res.data);
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

  const handleText = (value: any, index: number) => {
    let arr = [...contentBlocks];
    arr[index].content = value;
    setContentBlocks([...arr]);
  };

  const allSubmit = () => {
    (childRef.current as any).submitForm();
  };

  const handleFormSubmit = async (submitData: any) => {
    if (!data) {
      return;
    }
    console.log({
      title,
      content_blocks: contentBlocks,
      components: submitData,
    });
    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    saveOrSubmitProposal({
      title,
      proposal_category_id: data.proposal_category_id,
      content_blocks: contentBlocks,
      submit_to_metaforo: submitType === 'submit',
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
      <BackerNav title={t('Proposal.EditProposalNav')} to={'/proposal-v2'} onClick={() => navigate(-1)} />
      <Template
        DataSource={DataSource}
        operate="edit"
        initialItems={initialItems}
        BeforeComponent={
          <ItemBox>
            <TitleBox>提案标题</TitleBox>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </ItemBox>
        }
        AfterComponent={
          <div>
            {contentBlocks.map((item, index: number) => (
              <ItemBox key={`block_${index}`}>
                <TitleBox>{item.title}</TitleBox>

                <MdEditor
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
      {data?.state === ProposalState.PendingSubmit && (
        <Button onClick={handleSave}>{t('Proposal.SaveProposal')}</Button>
      )}
      <Button onClick={handleSubmit}>{t('Proposal.SubmitProposal')}</Button>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding};
  color: var(--bs-body-color_active);
`;

const ItemBox = styled.div`
  margin-bottom: 20px;
`;

const TitleBox = styled.div`
  background: #f1f1f1;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  box-sizing: border-box;
`;
