import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ContainerPadding } from '../../assets/styles/global';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

const PageStyle = styled.div`
  ${ContainerPadding};
`;

const Box = styled.div`
  background: #fff;
  padding: 40px 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  .col-md-3 {
    margin-bottom: 20px;
  }
`;
const InnerBox = styled.ul`
  background: #fff;
  box-shadow: rgba(44, 51, 73, 0.1) 0px 0.5rem 1rem 0px;
  border-radius: 20px;
  box-sizing: border-box;
  height: 100%;

  .imgBox {
    width: 100%;
    height: 140px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }
  .btm {
    padding: 20px;
    font-size: 12px;
    box-sizing: border-box;
  }
  li {
    margin-bottom: 10px;
    &.line2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`;

const Tit = styled.li`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 70px;
  background: #f5f5f5;
  padding: 10px;
`;

const TagBox = styled.div`
  background: var(--bs-primary);
  display: inline-block;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
  opacity: 0.5;
  &.active {
    opacity: 1;
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

export default function Pub() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let result = await axios.get(`https://notion-api.splitbee.io/v1/table/73d83a0a-258d-4ac5-afa5-7a997114755a`);
      setList(result.data);
    } catch (e: any) {
      console.error(e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
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

  const ToGo = (id: string) => {
    navigate(`/pubDetail/${id}`);
  };

  return (
    <PageStyle>
      {/*{loading && <LoadingBox />}*/}
      <Box>
        <Row>
          {list.map((item: any, index) => (
            <Col md={3} key={index} onClick={() => ToGo(item.id)}>
              <InnerBox>
                {/*<div className="imgBox">*/}
                {/*  <img src="https://seedao-store.s3-us-east-2.amazonaws.com/seeu/su8JtN3BUjBpE2yrGWzK98.jpg" alt="" />*/}
                {/*</div>*/}
                <ul className="btm">
                  <Tit>{item['悬赏名称']}</Tit>
                  {item['悬赏状态'] && (
                    <li>
                      <TagBox className={item['悬赏状态'] === '招募中' ? 'active' : ''}>{item['悬赏状态']}</TagBox>
                    </li>
                  )}

                  <li>招募截止时间：{item['招募截止时间']}</li>
                  <li>
                    {item['悬赏类型'] &&
                      (item['悬赏类型'] as any).map((innerItem: string, innerIndex: number) => (
                        <TypeBox key={`${index}_${innerIndex}`} className={returnColor(innerItem)}>
                          {innerItem}
                        </TypeBox>
                      ))}
                  </li>
                  <li className="line2">{item['贡献报酬']}</li>
                </ul>
              </InnerBox>
            </Col>
          ))}
        </Row>
      </Box>
    </PageStyle>
  );
}
