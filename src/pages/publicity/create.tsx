import styled, { css } from "styled-components";
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdEditor } from "md-editor-rt";
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { UploadPictures } from "../../requests/proposalV2";
import { createPublicity, getPublicityDetail, updatePublicity } from "../../requests/publicity";
import useToast, { ToastType } from "../../hooks/useToast";

const { Check } = Form;

const CreateBox = styled.div`
`;

const FormGroup = styled(Form.Group)`
  .checkbox {
    width: unset;
  }
  margin-bottom: 30px;
  .timer-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
    .inputLine{
        width: 50%;
    }
`;

const FormLabel = styled(Form.Label)`
  margin-bottom: 14px;
  font-family: unset;
  .required {
    color: darkred;
  }
`;

const FormInput = styled(Form.Control)`
  min-width: 200px;
`;

const SubmitBox = styled.div`
  margin-top: 30px;
  button {
    min-width: 120px;
  }
`;

const FlexLine = styled.div`
  display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 10px;
    
`

export default function CreatePublicity(){
  const { t } = useTranslation();
  const [radioValue, setRadioValue] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [href, setHref] = useState('');
  const [type, setType] = useState('create');

  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    state: { theme },
    dispatch,
  } = useAuthContext();

  const { pathname } = useLocation();
  const { id } = useParams();


  useEffect(() => {
    if(!id || type ==="create")return;
    getEdit()
  }, [id,type]);

  const getEdit = async()=>{
    try{
      let rt = await getPublicityDetail(id!);
      const {data:{title,content}} = rt;
      setTitle(title)
      setContent(content);
    }catch(error){
      console.error(error)
    }

  }

  useEffect(() => {
    if(pathname.indexOf("edit")>-1){
      setType("edit")
    }else{
      setType("create")
    }

  }, [pathname]);


  const handleText = (value: any) => {
    setContent(value)
  };


  // const handleValueChange = () => {
  //   setRadioValue(!radioValue)
  // }


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

  const handleSubmit = () =>{
    if(type === 'create'){
      handleCreate()
    }else{
      id && handleUpdate()
    }
  }


  const handleUpdate = async() => {
    let obj={
      title,
      content,
      id:Number(id)!
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      let rt = await updatePublicity(obj)
      showToast(t('Project.createSuccess'), ToastType.Success);
      navigate(`/city-hall/publicity/list`);
      console.error(rt)
    }catch(error:any){
      showToast(error?.response?.data?.message || error, ToastType.Danger);
      console.error(error)
    }finally {

      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }

  const handleCreate = async() => {
    let obj={
      title,
      content
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      let rt = await createPublicity(obj)
      showToast(t('Project.createSuccess'), ToastType.Success);
      navigate(`/city-hall/publicity/list`);
      console.error(rt)
    }catch(error:any){
      showToast(error?.response?.data?.message || error, ToastType.Danger);
      console.error(error)
    }finally {

      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }

  return <CreateBox>
    <Form>
      <FormGroup>
        <FormLabel>
          {t('Push.Title')} <span className="required">*</span>
        </FormLabel>
        <FormInput
          type="text"
          className="inputLine"
          value={title} onChange={(e: any) => setTitle(e.target.value)}
        />
      </FormGroup>

      {/*<FlexLine>*/}
      {/*  <Check*/}
      {/*    id="chooseTypeRadio1"*/}
      {/*    type="radio"*/}
      {/*    name="chooseTypeRadio"*/}
      {/*    checked={radioValue}*/}
      {/*    onChange={() => handleValueChange()}*/}
      {/*    onClick={(e) => handleValueChange()}*/}

      {/*  />*/}
      {/*  <label htmlFor="chooseTypeRadio1"> {t('city-hall.externalLink')}</label>*/}
      {/*</FlexLine>*/}

      {/*{*/}
      {/*  radioValue &&   <FormGroup>*/}
      {/*    <FormLabel>*/}
      {/*      {t('Push.Href')}*/}
      {/*    </FormLabel>*/}
      {/*    <FormInput*/}
      {/*      type="text"*/}
      {/*      placeholder="https://..."*/}
      {/*      value={href}*/}
      {/*      onChange={(e: any) => setHref(e.target.value)}*/}
      {/*    />*/}
      {/*  </FormGroup>*/}
      {/*}*/}
      <FormGroup>
          <FormLabel>{t("city-hall.content")}</FormLabel>
          {/*<FormInput*/}
          {/*  className="form-control"*/}
          {/*  as="textarea"*/}
          {/*  rows={5}*/}
          {/*  value={content}*/}
          {/*  onChange={(e: any) => setContent(e.target.value)}*/}
          {/*/>*/}

        <MdEditor
          toolbarsExclude={['github', 'save']}
          modelValue={content}
          editorId={`publicity_editor`}
          onUploadImg={(files, callBack) => uploadPic(files, callBack)}
          onChange={(val) => handleText(val)}
          theme={theme ? 'dark' : 'light'}
          // placeholder={}
        />
        </FormGroup>



      <SubmitBox>
        {/*<Button variant="primary" type="submit" disabled={!title || (!radioValue && !content) || (radioValue && !href)} onClick={()=>handleSubmit()} >*/}
        <Button variant="primary" disabled={!title || !content} onClick={()=>handleSubmit()} >
          {t('city-hall.create')}
        </Button>
      </SubmitBox>
    </Form>
  </CreateBox>
}
