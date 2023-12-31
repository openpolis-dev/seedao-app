import styled from 'styled-components';

import { Template } from '@seedao/components';
import initialItems from './json/initialItem';
import DataSource from './json/datasource.json';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import { saveOrSubmitProposal } from 'requests/proposalV2';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useCheckMetaforoLogin from 'hooks/useCheckMetaforoLogin';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import BackerNav from '../../../components/common/backNav';
import BackIcon from '../../../assets/Imgs/back.svg';
import ConfirmModal from 'components/modals/confirmModal';
import { useCreateProposalContext } from './store';

const Box = styled.ul`
  position: relative;
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

const FixedBox = styled.div`
  background: #fff;
  position: sticky;
  margin: -24px 0 0 -32px;
  width: calc(100% + 64px);
  top: 0;
  height: 64px;
  z-index: 99;
  box-sizing: border-box;
  padding-right: 372px;
  box-shadow: 0px 4px 8px 0px rgba(138, 134, 146, 0.1);
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
    border: 1px solid #e9ebed;
    color: #000;
  }
`;

const BoxBg = styled.div`
  background: #fff;
  margin-top: 24px;
  border-radius: 8px;

  width: calc(100% - 410px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  box-sizing: border-box;
`;

export default function CreateStep() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const childRef = useRef(null);
  const [title, setTitle] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [submitType, setSubmitType] = useState<'save' | 'submit'>();

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const { dispatch } = useAuthContext();
  const { changeStep } = useCreateProposalContext();
  const checkMetaforoLogin = useCheckMetaforoLogin();

  useEffect(() => {
    let arr = [
      {
        title: 'Background',
        content: 'This is a background block',
      },
      {
        title: 'Detail',
        content: 'This is a detail block',
      },
    ];
    setList([...arr]);
  }, []);

  const handleInput = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setTitle(value);
  };

  const handleFormSubmit = async (data: any) => {
    console.log({
      title,
      content_blocks: list,
      components: data,
    });
    await checkMetaforoLogin();
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    saveOrSubmitProposal({
      title,
      proposal_category_id: 41, // TODO hardcode for test
      content_blocks: list,
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
    setSubmitType('submit');
    setTimeout(allSubmit, 0);
  };

  const handleBack = () => {
    setShowLeaveConfirm(false);
    changeStep(1);
  };
 
  return (
    <Box>
      <FixedBox>
        <FlexInner>
          <BackBox onClick={() => setShowLeaveConfirm(true)}>
            <BackIconBox>
              <img src={BackIcon} alt="" />
            </BackIconBox>
            <span className="backTitle">返回</span>
          </BackBox>

          <BtnGroup>
            <Button className="save" onClick={handleSave}>
              {t('Proposal.SaveProposal')}
            </Button>
            <Button onClick={handleSubmit}>{t('Proposal.SubmitProposal')}</Button>
          </BtnGroup>
        </FlexInner>
      </FixedBox>

      <BoxBg>
        <Template
          DataSource={DataSource}
          operate="edit"
          initialItems={initialItems}
          BeforeComponent={
            <ItemBox>
              <TitleBox>提案标题</TitleBox>
              <input type="text" value={title} onChange={handleInput} />
            </ItemBox>
          }
          AfterComponent={
            <div>
              {list.map((item, index: number) => (
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
