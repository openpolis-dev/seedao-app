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
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [contact, setContact] = useState<any[]>([]);

  const [props, setProps] = useState();

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

  const getDetail = async (id: string) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      // let detailInfo = await getInfo(id);
      let detailInfo = await pubDetail(id);
      let detail = detailInfo.data.properties;

      setProps(detail);
      const titleStr = detail?.['悬赏名称'].title[0].text.content ?? '';
      setTitle(titleStr);
      let url = detailInfo?.data?.cover?.file?.url || detailInfo?.data?.cover?.external.url;
      setImgUrl(url);

      setStatus(detail?.['悬赏状态']?.select?.name ?? '');

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
      logError(e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const renderElement = (detail: any) => {
    const elements: any[] = [];
    let str: any;
    for (const key in detail) {
      if (detail.hasOwnProperty(key)) {
        switch (detail[key].type) {
          case 'multi_select':
            let arr: any[] = [];
            detail[key]?.multi_select.map((item: any, index: number) => {
              arr.push(
                <TypeBox key={index} className={returnColor(item.name)}>
                  {item.name}
                </TypeBox>,
              );
            });
            str = arr;
            break;
          case 'rich_text':
            str = detail[key].rich_text[0]?.text?.content || detail[key].rich_text[0]?.plain_text;
            break;

          default:
            str = '';
            break;
        }
      }

      str &&
        !key.includes('对接人') &&
        elements.push(
          <Row>
            <Col md={2} key={key}>
              {key}
            </Col>
            <Col md={10}>
              <PreBox>{str}</PreBox>
            </Col>
          </Row>,
        );
    }
    return elements;
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

        <BackerNav title={title} to={`/hub`} mb="40px" />
        {!!imgUrl && (
          <ImgBox>
            <img src={imgUrl} alt="" />
          </ImgBox>
        )}

        <FlexBox>
          <TopRht>
            <TagBox className={returnStatus(status)}> {status}</TagBox>
          </TopRht>
          <Title>{title}</Title>
          <ContentBox>
            <>{renderElement(props)}</>
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
