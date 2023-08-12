import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Card } from '@paljs/ui/Card';
import { EvaIcon } from '@paljs/ui/Icon';

import useTranslation from 'hooks/useTranslation';

import { Ievent } from 'type/event';
import ReactMarkdown from 'react-markdown';
import { getEventById } from 'requests/event';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
`;

const CardBox = styled(Card)`
  min-height: 85vh;
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

const ContentBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 40px 20px;
  border-bottom: 1px solid #eee;
`;

const LftBox = styled.div`
  width: 30%;
  flex-shrink: 0;
  img {
    width: 100%;
  }
`;
const RhtBox = styled.div`
  width: 69%;
  padding: 10px 0;
`;
const TitBox = styled.div`
  font-size: 2rem;
  line-height: 1.2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
`;
const RhtCenter = styled.ul`
  border-bottom: 1px solid #eee;
  padding: 20px 0;
  .icon {
    margin-right: 10px;
  }
  li {
    display: flex;
    align-content: center;
    padding: 5px 10px;
  }
`;

const Btm = styled.div`
  dl {
    margin-top: 20px;
    display: flex;
    align-content: center;
    line-height: 2em;
  }
  dt {
    font-weight: bold;
    width: 150px;
    background: #f5f5f5;
    padding: 0 10px;
    margin-right: 20px;
    text-align: center;
  }
`;

const MainContent = styled.div`
  padding: 40px;
`;
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [detail, setDetail] = useState<Ievent | undefined>();
  const [meta, setMeta] = useState();

  useEffect(() => {
    if (!id) return;
    getDetail();
  }, [id]);

  const getDetail = async () => {
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getEventById(id as string);
    const { metadata } = dt.data;
    console.log(metadata);
    // setMeta(JSON.parse(meta))

    setDetail(dt.data);
  };

  return (
    <Layout title="SeeDAO Project">
      <CardBox>
        <Box>
          <div>
            <BackBox onClick={() => router.back()}>
              <EvaIcon name="chevron-left-outline" className="icon" /> <span> {t('general.back')}</span>
            </BackBox>
          </div>

          <ContentBox>
            <LftBox>
              <img src={detail?.cover_img} alt="" />
            </LftBox>
            <RhtBox>
              <TitBox>{detail?.title}</TitBox>
              <RhtCenter>
                <li>
                  <EvaIcon name="clock-outline" className="icon" /> <span>Sat, Aug 12, 2023, 3:00 PM</span>
                </li>
              </RhtCenter>

              <Btm>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
              </Btm>
            </RhtBox>
          </ContentBox>

          <MainContent>
            <ReactMarkdown>{detail?.content}</ReactMarkdown>
          </MainContent>
        </Box>
      </CardBox>
    </Layout>
  );
}
