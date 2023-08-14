import Layout from 'Layouts';
import { Card, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import React, { FormEvent, useEffect, useState } from 'react';
import { EvaIcon } from '@paljs/ui/Icon';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import ReactMarkdown from 'react-markdown';
import { getEventById, uplodaEventImage } from 'requests/event';
import { formatTime } from 'utils/time';

const Box = styled.div`
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled(Card)`
  min-height: 80vh;
`;
const UlBox = styled.div`
  width: 100%;

  li {
    display: flex;
    align-items: flex-start;
    margin-top: 1rem;
    line-height: 2.5em;
  }
  .title {
    margin-right: 20px;
    line-height: 2.5em;
    min-width: 180px;
    background: #f7f9fc;
    padding: 0 20px;
    text-align: right;
  }
`;

const BackBox = styled.div`
  padding: 30px 20px 0;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .icon {
    font-size: 24px;
  }
`;

const BtnBox = styled.label`
  width: 35%;
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
  line-height: 1.2em;
  p {
    padding: 1rem -0px;
  }
`;

const TitleTop = styled.div`
  font-size: 2.5rem;
  line-height: 1.2em;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  display: flex;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
`;

const TimeBox = styled.div`
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  font-size: 1.1rem;
  .iconRht {
    margin-right: 1rem;
  }
`;

export default function ViewEvent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;

  const { dispatch } = useAuthContext();

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState<number>();
  const [endAt, setEndAt] = useState<number>();
  const [sponsor, setSponsor] = useState('');
  const [moderator, setmoderator] = useState('');
  const [guest, setGuest] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const [url, setUrl] = useState('');

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
  };

  return (
    <Layout title="SeeDAO | Create Guild">
      <Box>
        <CardBox>
          <div>
            <BackBox onClick={() => router.back()}>
              <EvaIcon name="chevron-left-outline" className="icon" /> <span>{t('general.back')}</span>
            </BackBox>
          </div>

          {/*<CardHeader> {id ? t('event.edit') : t('event.create')}</CardHeader>*/}
          <CardBody>
            <InnerBox>
              <BtnBox>
                {!!url && (
                  <ImgBox>
                    <img src={url} alt="" />
                  </ImgBox>
                )}
              </BtnBox>
              <UlBox>
                <TitleTop>{title}</TitleTop>
                <TimeBox>
                  <EvaIcon name="clock-outline" className="iconRht" />
                  <span>{formatTime(startAt)}</span> ~ <span>{formatTime(endAt)}</span>
                </TimeBox>

                {!!sponsor && (
                  <li>
                    <div className="title">{t('event.sponsor')}</div>
                    <div>{sponsor}</div>
                  </li>
                )}
                {!!media && (
                  <li>
                    <div className="title">{t('event.media')}</div>
                    <div>{media}</div>
                  </li>
                )}
                {!!moderator && (
                  <li>
                    <div className="title">{t('event.host')}</div>
                    <div>{moderator}</div>
                  </li>
                )}
                {!!guest && (
                  <li>
                    <div className="title">{t('event.guest')}</div>
                    <div>{guest}</div>
                  </li>
                )}
                {!!volunteer && (
                  <li>
                    <div className="title">{t('event.volunteer')}</div>
                    <div>{volunteer}</div>
                  </li>
                )}
              </UlBox>
            </InnerBox>
            <ContentBox>
              <ReactMarkdown>{content}</ReactMarkdown>
            </ContentBox>
          </CardBody>
        </CardBox>
      </Box>
    </Layout>
  );
}
