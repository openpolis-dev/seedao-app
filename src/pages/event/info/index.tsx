import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import { InputGroup } from '@paljs/ui/Input';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { createEvent, editEventById, getEventById, uplodaEventImage } from 'requests/event';

const Box = styled.div`
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled(Card)`
  min-height: 80vh;
`;

const BtmBox = styled.div`
  margin: 50px 0;
  padding-left: 440px;
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
  padding: 30px 20px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .icon {
    font-size: 24px;
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
    padding: 6px;
    border-radius: 100%;
    background: #a16eff;
    color: #fff;
    cursor: pointer;
  }
`;

const InnerBox = styled.div`
  display: flex;
  align-content: center;
`;

const ContentBox = styled.div`
  .cm-scroller {
    background: #f7f9fc;
  }
`;

export default function CreateGuild() {
  const router = useRouter();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();

  const {
    state: { language },
  } = useAuthContext();

  const { id } = router.query;

  const { dispatch } = useAuthContext();

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
    const { metadata, title, start_at, end_at, content, cover_img } = dt.data;

    setTitle(title);
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

  // useEffect(() => {
  //   window && require('./font_2605852_u82y61ve02');
  // }, [window]);

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
    } catch (e) {
      console.error('create event error:', e);
      showToast(e.data?.msg, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const updateLogo = async (e: FormEvent) => {
    const { files } = e.target as any;
    // const url = window.URL.createObjectURL(files[0]);
    const { name, type } = files[0];
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const urlObj = await uplodaEventImage(name, type, files[0]);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setUrl(urlObj);
  };

  const removeUrl = () => {
    setUrl('');
  };

  return (
    <Layout title="SeeDAO | Create Guild">
      <Box>
        {Toast}
        <CardBox>
          <div>
            <BackBox onClick={() => router.back()}>
              <EvaIcon name="chevron-left-outline" className="icon" /> <span>{t('general.back')}</span>
            </BackBox>
          </div>

          {/*<CardHeader> {id ? t('event.edit') : t('event.create')}</CardHeader>*/}
          <CardBody>
            <InnerBox>
              <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
                {!url && (
                  <div>
                    <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                    <EvaIcon name="cloud-upload-outline" className="iconRht" />
                    <span>{t('event.upload')}</span>
                  </div>
                )}
                {!!url && (
                  <ImgBox>
                    <div className="del" onClick={() => removeUrl()}>
                      <EvaIcon name="close-outline" status="Control" />
                    </div>
                    <img src={url} alt="" />
                  </ImgBox>
                )}
              </BtnBox>
              <UlBox>
                <li>
                  <div className="title">{t('event.title')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={title} onChange={(e) => handleInput(e, 'title')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.startTime')}</div>
                  <InputBox fullWidth>
                    <DatePicker
                      showTimeSelect
                      minDate={new Date()}
                      selected={startAt}
                      dateFormat="yyyy-MM-dd HH:mm aa"
                      onChange={(date) => setStartAt(date!.valueOf())}
                      className="dateBox"
                    />
                    {/*<input type="text" value={startAt} onChange={(e) => handleInput(e, 'startAt')} />*/}
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.endTime')}</div>
                  <InputBox fullWidth>
                    <DatePicker
                      showTimeSelect
                      selected={endAt}
                      minDate={new Date(startAt!)}
                      onChange={(date) => setEndAt(date!.valueOf())}
                      dateFormat="yyyy-MM-dd HH:mm aa"
                    />
                    {/*<input type="text" value={endAt} onChange={(e) => handleInput(e, 'endAt')} />*/}
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.sponsor')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={sponsor} onChange={(e) => handleInput(e, 'sponsor')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.media')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={media} onChange={(e) => handleInput(e, 'media')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.host')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={moderator} onChange={(e) => handleInput(e, 'moderator')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.guest')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={guest} onChange={(e) => handleInput(e, 'guest')} />
                  </InputBox>
                </li>
                <li>
                  <div className="title">{t('event.volunteer')}</div>
                  <InputBox fullWidth>
                    <input type="text" value={volunteer} onChange={(e) => handleInput(e, 'volunteer')} />
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
              <ButtonLink appearance="outline" className="btnBtm" onClick={() => router.push('/event')}>
                {t('general.cancel')}
              </ButtonLink>
              <Button onClick={() => handleSubmit()}>{t('general.confirm')}</Button>
            </BtmBox>
          </CardBody>
        </CardBox>
      </Box>
    </Layout>
  );
}
