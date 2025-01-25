import { Button, InputGroup, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
// import { Button, ButtonLink } from '@paljs/ui/Button';
// import { EvaIcon } from '@paljs/ui/Icon';
// import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdEditor } from 'md-editor-rt';
import { createEvent, editEventById, getEventById, uplodaEventImage } from 'requests/event';

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Upload } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';

const OuterBox = styled.div`
  box-sizing: border-box;
  ${ContainerPadding};
`;

const Box = styled.div`
  background: #fff;
  padding: 20px;
  .btnBtm {
    margin-right: 20px;
  }
`;

const BtmBox = styled.div`
  margin: 50px 0;
`;

const UlBox = styled.ul`
  width: 100%;
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 22px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 180px;
      background: #f7f9fc;
      padding: 0 20px;
      text-align: right;
    }
  }
`;

const InputBox = styled(InputGroup)`
  margin-right: 20px;
  width: 100%;
  display: flex;
  .react-datepicker {
    display: flex;
    border: 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {
    right: 120px;
  }
  .react-datepicker__time-container {
    width: 120px;
    border-left: 1px solid #eee;
  }
  .react-datepicker__header {
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .react-datepicker__time-box {
    width: 120px !important;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const BackBox = styled.div`
  padding: 10px 0 20px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .iconTop {
    margin-right: 10px;
  }
`;

const BtnBox = styled.label`
  background: #f7f9fc;
  height: 480px;
  width: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-family: 'Barlow-Regular';
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 40px;
  margin-right: 40px;
  flex-shrink: 0;
  .iconRht {
    margin-right: 10px;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  @media (max-width: 900px) {
    margin: 40px auto;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .del {
    position: absolute;
    right: -15px;
    top: -15px;
    z-index: 999;
    border-radius: 100%;
    background: #a16eff;
    color: #fff;
    cursor: pointer;
    width: 30px;
    height: 30px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const InnerBox = styled.div`
  display: flex;
  align-content: center;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const ContentBox = styled.div`
  .cm-scroller {
    background: #f7f9fc;
  }
`;

export default function CreateGuild() {
  const { search } = window.location;
  const id = new URLSearchParams(search).get('id');
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const navigate = useNavigate();

  const {
    state: { language, account },
    dispatch,
  } = useAuthContext();

  // const { id } = router.query;

  // const { account } = useWeb3React();

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState<number>(0);
  const [endAt, setEndAt] = useState<number>(0);
  const [sponsor, setSponsor] = useState('');
  const [moderator, setmoderator] = useState('');
  const [guest, setGuest] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [url, setUrl] = useState('');
  const [lan, setLan] = useState('');
  const [creator, setCreator] = useState('');

  const [data] = useState({
    toobars: [
      'bold',
      'underline',
      'italic',
      'strikeThrough',
      'sub',
      'sup',
      'quote',
      'unorderedList',
      'orderedList',
      'codeRow',
      'code',
      'link',
      'image',
      'table',
      'revoke',
      'next',
      'pageFullscreen',
      'fullscreen',
      'preview',
      'htmlPreview',
    ],
    toolbarsExclude: ['github'],
  });

  useEffect(() => {
    const localLan = language === 'zh' ? 'zh-CN' : 'en-US';
    setLan(localLan);
  }, [language]);

  useEffect(() => {
    if (!id) return;
    getDetail();
  }, [id]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getEventById(id as string);
    dispatch({ type: AppActionType.SET_LOADING, payload: false });
    const { metadata, title, start_at, end_at, content, cover_img, initiator } = dt.data;

    setTitle(title);
    setCreator(initiator);
    const st = new Date(start_at);
    setStartAt(st.valueOf());
    const et = new Date(end_at);
    setEndAt(et.valueOf());
    setUrl(cover_img);
    setContent(content);
    if (metadata) {
      const { sponsor, moderator, media, guest, volunteer } = JSON.parse(metadata);
      setSponsor(sponsor);
      setmoderator(moderator);
      setMedia(media);
      setGuest(guest);
      setVolunteer(volunteer);
    } else {
      setSponsor('');
      setmoderator('');
      setMedia('');
      setGuest('');
      setVolunteer('');
    }

    // setMeta(JSON.parse(meta))

    // setDetail(dt.data);
  };

  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'title':
        setTitle(value);
        break;
      case 'startAt':
        setStartAt(Number(value));
        break;
      case 'endAt':
        setEndAt(Number(value));
        break;
      case 'sponsor':
        setSponsor(value);
        break;
      case 'moderator':
        setmoderator(value);
        break;
      case 'media':
        setMedia(value);
        break;
      case 'guest':
        setGuest(value);
        break;
      case 'volunteer':
        setVolunteer(value);
        break;
      case 'content':
        setContent(value);
        break;
    }
  };

  const handleSubmit = async () => {
    const itemObj = {
      sponsor,
      moderator,
      volunteer,
      media,
      guest,
    };

    const start_at = Math.floor(startAt! / 1000).toString();
    const end_at = Math.floor(endAt! / 1000).toString();

    const obj = {
      title,
      cover_img: url,
      content,
      start_at,
      end_at,
      metadata: JSON.stringify(itemObj),
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let rt;
      if (id) {
        rt = await editEventById(id, obj);
      } else {
        rt = await createEvent(obj);
      }
      showToast('Success', ToastType.Success);
      navigate('/event');
    } catch (error: any) {
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      // showToast(e.response?.data?.msg || JSON.stringify(e), ToastType.Danger);
      console.log(error);
      logError('create event error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const updateLogo = async (e: FormEvent) => {
    try{
      const { files } = e.target as any;
      // const url = window.URL.createObjectURL(files[0]);
      const { name, type } = files[0];
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      const urlObj = await uplodaEventImage(name, type, files[0]);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      setUrl(urlObj);
    }catch(error:any){
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }

  };

  const removeUrl = () => {
    setUrl('');
  };

  const changeEnd = (time: number) => {
    if (startAt > time) {
      setEndAt(0);
    } else {
      setEndAt(time);
    }
  };
  const ChangeStart = (time: number) => {
    setStartAt(time);
    if (time > endAt) {
      setEndAt(0);
    }
  };

  if (account && creator && account.toLocaleLowerCase() !== creator) {
    navigate('/');
  }
  return (
    <OuterBox>
      <Box>
        {Toast}

        <div>
          <BackBox onClick={() => navigate(-1)}>
            <ChevronLeft className="iconTop" />
            <span>{t('general.back')}</span>
          </BackBox>
        </div>

        {/*<CardHeader> {id ? t('event.edit') : t('event.create')}</CardHeader>*/}
        <div>
          <InnerBox>
            <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
              {!url && (
                <div>
                  <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                  <Upload className="iconRht" />
                  <span>{t('event.upload')}</span>
                </div>
              )}
              {!!url && (
                <ImgBox>
                  <div className="del" onClick={() => removeUrl()}>
                    {/*<EvaIcon name="close-outline" status="Control" />*/}
                    <X />
                  </div>
                  <img src={url} alt="" />
                </ImgBox>
              )}
            </BtnBox>
            <UlBox>
              <li>
                <div className="title">{t('event.title')}</div>
                <InputBox>
                  <Form.Control type="text" value={title} onChange={(e) => handleInput(e, 'title')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.startTime')}</div>
                <InputBox>
                  <DatePicker
                    showTimeSelect
                    minDate={new Date()}
                    timeFormat="HH:mm aa"
                    selected={startAt ? new Date(startAt) : null}
                    dateFormat="yyyy-MM-dd HH:mm aa"
                    onChange={(date) => ChangeStart(date!.valueOf())}
                    className="dateBox"
                  />
                  {/*<input type="text" value={startAt} onChange={(e) => handleInput(e, 'startAt')} />*/}
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.endTime')}</div>
                <InputBox>
                  <DatePicker
                    showTimeSelect
                    selected={endAt ? new Date(endAt) : null}
                    timeFormat="HH:mm aa"
                    minDate={new Date(startAt!)}
                    onChange={(date) => changeEnd(date!.valueOf())}
                    dateFormat="yyyy-MM-dd HH:mm aa"
                    className="dateBox"
                  />
                  {/*<input type="text" value={endAt} onChange={(e) => handleInput(e, 'endAt')} />*/}
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.sponsor')}</div>
                <InputBox>
                  <Form.Control type="text" value={sponsor} onChange={(e) => handleInput(e, 'sponsor')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.media')}</div>
                <InputBox>
                  <Form.Control type="text" value={media} onChange={(e) => handleInput(e, 'media')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.host')}</div>
                <InputBox>
                  <Form.Control type="text" value={moderator} onChange={(e) => handleInput(e, 'moderator')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.guest')}</div>
                <InputBox>
                  <Form.Control type="text" value={guest} onChange={(e) => handleInput(e, 'guest')} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('event.volunteer')}</div>
                <InputBox>
                  <Form.Control type="text" value={volunteer} onChange={(e) => handleInput(e, 'volunteer')} />
                </InputBox>
              </li>
            </UlBox>
          </InnerBox>
          <ContentBox>
            <MdEditor
              modelValue={content}
              onChange={(val) => {
                setContent(val);
              }}
              toolbars={data.toobars as any}
              language={lan}
              codeStyleReverse={false}
              noUploadImg
            />
          </ContentBox>
          <BtmBox>
            <Button variant="outline-primary" className="btnBtm" onClick={() => navigate('/event')}>
              {t('general.cancel')}
            </Button>
            <Button onClick={() => handleSubmit()} disabled={!title || !startAt || !endAt}>
              {t('general.confirm')}
            </Button>
          </BtmBox>
        </div>
      </Box>
    </OuterBox>
  );
}
