import styled from 'styled-components';
import { ContainerPadding } from '../../assets/styles/global';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import { ChevronLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { pubDetail } from '../../requests/publicData';
import axios from 'axios';

import BackerNav from 'components/common/backNav';

const PageStyle = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;

const Box = styled.div`
  width: 900px;

  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 24px;
  font-family: 'Poppins-SemiBold';
  color: var(--bs-body-color_active);
`;
const ContentBox = styled.div`
  margin-top: 40px;
  font-size: 12px;
  color: var(--bs-body-color_active);
  .row {
    margin-bottom: 20px;
  }
  pre {
    font-size: 12px;
  }
`;

const TagBox = styled.div`
  background: var(--bs-primary);
  display: inline-block;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;

  &.str1 {
    background: #b0b0b0;
  }
  &.str2 {
    background: var(--bs-primary);
  }
  &.str3 {
    background: #00a92f;
  }
`;

const TypeBox = styled(TagBox)`
  padding: 3px 5px;
  opacity: 1;
  margin: 0 10px 10px 0;
  color: #000;
  &.type1 {
    background: rgb(250, 222, 201);
  }
  &.type2 {
    background: rgb(253, 236, 200);
  }
  &.type3 {
    background: rgb(255, 226, 221);
  }

  &.type4 {
    background: rgb(219, 237, 219);
  }
  &.type5 {
    background: rgb(227, 226, 224);
  }
  &.type6 {
    background: rgb(211, 229, 239);
  }
  &.type7 {
    background: rgb(238, 224, 218);
  }
`;
const LinkBox = styled.div`
  a {
    margin-right: 20px;
    color: var(--bs-primary);
  }
`;

const BackBox = styled.div`
  padding: 10px 0 20px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .iconTop {
    margin-right: 10px;
    color: var(--bs-body-color);
    font-size: 12px;
  }
  span {
    color: var(--bs-body-color);
    font-size: 12px;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  margin-bottom: 14px;
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
`;

const TopRht = styled.div`
  position: absolute;
  right: 24px;
  font-size: 12px;
`;

const FlexBox = styled.div`
  flex-grow: 1;
  //border: 1px solid var(--bs-border-color);
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-box);
  border-radius: 16px;
  padding: 24px;
`;

const PreBox = styled.div`
  white-space: pre-wrap;
`;

export default function PubDetail() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [tag, setTag] = useState([]);
  const [desc, setDesc] = useState('');
  const [reward, setReward] = useState('');
  const [jd, setJd] = useState('');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState<any[]>([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    getDetail(id);
  }, [id]);

  const getInfo = async (str: string) => {
    return await axios.get(`https://notion-api.splitbee.io/v1/page/${str}`);
  };

  const returnColor = (str: string) => {
    let colorStr = '';
    switch (str?.trim()) {
      case '项目招募 | Project Recruitment':
      case '项目招募':
        colorStr = 'type1';
        break;
      case '外部招募 | external recruitment':
        colorStr = 'type2';
        break;
      case '公会招募  | Guild Recruitment':
        colorStr = 'type3';
        break;
      case '个人组队 | Team recruitment':
        colorStr = 'type4';
        break;
      case '市政厅招募 | City hall recruitment':
        colorStr = 'type5';
        break;
      case '新手任务':
        colorStr = 'type6';
        break;
      case '孵化器Workshop':
      default:
        colorStr = 'type7';
        break;
    }
    return colorStr;
  };

  // const flattenArray = (arr: any[]) => {
  //   let flattened: any[] = [];
  //
  //   arr.forEach((item) => {
  //     if (Array.isArray(item)) {
  //       flattened = flattened.concat(flattenArray(item));
  //     } else {
  //       flattened.push(item);
  //     }
  //   });
  //
  //   return flattened;
  // };

  const getDetail = async (id: string) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      // let detailInfo = await getInfo(id);
      let detailInfo = await pubDetail(id);
      let detail = detailInfo.data.properties;
      const titleStr = detail?.['悬赏名称'].title[0].text.content ?? '';
      setTitle(titleStr);
      let url = detailInfo?.data?.cover?.file?.url || detailInfo?.data?.cover?.external.url;
      setImgUrl(url);

      setStatus(detail?.['悬赏状态']?.select?.name ?? '');
      setTag(detail?.['悬赏类型']?.multi_select ?? []);

      setDesc(detail?.['任务说明'].rich_text[0].text.content ?? '');
      setReward(detail?.['贡献报酬']?.rich_text[0]?.plain_text);
      setJd(detail?.['技能要求'].rich_text[0].text.content ?? '');
      setTime(detail?.['招募截止时间']?.rich_text[0]?.plain_text ?? '');
      let contactArr = detail?.['👫 对接人']?.rich_text;

      let arr: any[] = [];
      contactArr.map(async (item: any) => {
        let idStr = item.mention.page.id;
        let rt = await getInfo(idStr);

        arr.push({
          name: rt?.data[idStr]?.value.properties.title[0][0] ?? '',
          id: idStr.replace(/-/g, ''),
        });
        setContact([...arr]);
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const returnStatus = (str: string) => {
    let cStr = '';
    switch (str?.trim()) {
      case '已归档':
        cStr = 'str1';
        break;
      case '已认领':
        cStr = 'str2';
        break;
      case '招募中':
      default:
        cStr = 'str3';
        break;
    }
    return cStr;
  };
  return (
    <PageStyle>
      <Box>
        {/*<BackBox onClick={() => navigate(-1)}>*/}
        {/*  <ChevronLeft className="iconTop" />*/}
        {/*  <span>{title}</span>*/}
        {/*</BackBox>*/}

        <BackerNav title={title} to={`/pub`} mb="40px" />
        <ImgBox>
          <img src={imgUrl} alt="" />
        </ImgBox>
        <FlexBox>
          <TopRht>
            <TagBox className={returnStatus(status)}> {status}</TagBox>
          </TopRht>
          <Title>{title}</Title>
          <ContentBox>
            <Row>
              <Col md={2}>悬赏类型</Col>
              <Col md={10}>
                {tag.map((item: any, index) => (
                  <TypeBox key={index} className={returnColor(item.name)}>
                    {item.name}
                  </TypeBox>
                ))}
              </Col>
            </Row>
            <Row>
              <Col md={2}>任务说明</Col>
              <Col md={10}>
                <PreBox>{desc}</PreBox>
              </Col>
            </Row>
            <Row>
              <Col md={2}>贡献报酬</Col>
              <Col md={10}>{reward}</Col>
            </Row>
            <Row>
              <Col md={2}>技能要求</Col>
              <Col md={10}>
                <PreBox>{jd}</PreBox>
              </Col>
            </Row>
            <Row>
              <Col md={2}>招募截止时间</Col>
              <Col md={10}>{time}</Col>
            </Row>
            <Row>
              <Col md={2}>👫 对接人</Col>
              <Col md={10}>
                <LinkBox>
                  {contact.map((item: any, index) => (
                    <a
                      href={`https://www.notion.so/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      key={`contact_${index}`}
                    >
                      {item.name}
                    </a>
                  ))}
                </LinkBox>
              </Col>
            </Row>
          </ContentBox>
        </FlexBox>
      </Box>
    </PageStyle>
  );
}
