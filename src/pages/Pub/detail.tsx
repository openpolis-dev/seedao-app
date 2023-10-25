import styled from 'styled-components';
import { ContainerPadding } from '../../assets/styles/global';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

const PageStyle = styled.div`
  ${ContainerPadding};
`;

const Box = styled.div`
  background: #fff;
  padding: 40px 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  font-size: 20px;
`;
const ContentBox = styled.div`
  margin-top: 40px;
  font-size: 12px;
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
  opacity: 0.5;
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
    text-decoration: underline;
    color: var(--bs-primary);
  }
`;

export default function PubDetail() {
  const { dispatch } = useAuthContext();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
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
    switch (str.trim()) {
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

  const flattenArray = (arr: any[]) => {
    let flattened: any[] = [];

    arr.forEach((item) => {
      if (Array.isArray(item)) {
        flattened = flattened.concat(flattenArray(item));
      } else {
        flattened.push(item);
      }
    });

    return flattened;
  };

  const getDetail = async (id: string) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let detailInfo = await getInfo(id);
      let detail = detailInfo.data[id]?.value.properties;
      const titleStr = detail?.title[0][0] ?? '';
      setTitle(titleStr);

      setStatus(detail?.ArpA[0][0] ?? '');
      setTag(detail?.['GJ=R'][0] ?? []);
      setDesc(detail?.['Bzg@'][0][0] ?? '');
      setReward(detail?.['_zm^'][0][0] ?? '');
      setJd(detail?.['~B<}'][0][0] ?? '');
      setTime(detail?.['iSkG'][0][0] ?? '');

      let contactArr = detail?.['ax\\\\'];
      const flattenedArray = flattenArray(contactArr);
      const contactList = flattenedArray.filter(
        (item) => item.length > 30 && item !== '5a4585f0-41bf-46b1-8321-4c9d55abc37a',
      );

      let arr: any[] = [];
      contactList.map(async (item) => {
        let rt = await getInfo(item);
        console.log(item.replace(/-/g, ''));
        arr.push({
          name: rt?.data[item]?.value.properties.title[0][0] ?? '',
          id: item.replace(/-/g, ''),
        });
        setContact([...arr]);
      });
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  return (
    <PageStyle>
      <Box>
        <Title>{title}</Title>
        <ContentBox>
          <Row>
            <Col md={2}>悬赏类型</Col>
            <Col md={10}>
              {tag.map((item, index) => (
                <TypeBox key={index} className={returnColor(item)}>
                  {item}
                </TypeBox>
              ))}
            </Col>
          </Row>
          <Row>
            <Col md={2}>任务说明</Col>
            <Col md={10}>
              <pre>{desc}</pre>
            </Col>
          </Row>
          <Row>
            <Col md={2}>悬赏状态</Col>
            <Col md={10}>
              <TagBox> {status}</TagBox>
            </Col>
          </Row>
          <Row>
            <Col md={2}>贡献报酬</Col>
            <Col md={10}>{reward}</Col>
          </Row>
          <Row>
            <Col md={2}>技能要求</Col>
            <Col md={10}>
              <pre>{jd}</pre>
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
      </Box>
    </PageStyle>
  );
}
