import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ContainerPadding } from '../../assets/styles/global';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import { useTranslation } from 'react-i18next';
import Links from '../../utils/links';
import { ChevronLeft } from 'react-bootstrap-icons';
import { publicList } from '../../requests/publicData';
import Page from '../../components/pagination';
import BackerNav from '../../components/common/backNav';

const PageStyle = styled.div`
  ${ContainerPadding};
`;

const Box = styled.div``;

const UlBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-right: -20px;
  .libox {
    width: 16.6666667%;
    padding-right: 20px;
    margin-bottom: 24px;
    flex-shrink: 0;
    &:last-child {
      margin-right: auto;
    }
  }
  @media (max-width: 1750px) {
    .libox {
      width: 20%;
    }
  }
  @media (max-width: 1500px) {
    .libox {
      width: 25%;
    }
  }
  @media (max-width: 1200px) {
    .libox {
      width: 33.333333%;
    }
  }
`;

const InnerBox = styled.ul`
  background: var(--bs-box-background);
  box-shadow: var(--box-shadow);

  border-radius: 16px;
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
      min-height: 140px;
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
      -webkit-line-clamp: 1;
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
  color: var(--bs-body-color_active);
  font-family: 'Poppins-SemiBold';
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
  padding: 3px 10px;
  opacity: 1;
  margin: 5px 10px 10px 0;
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

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
`;

export default function Pub() {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const { t } = useTranslation();

  const [pageCur, setPageCur] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getList();
  }, [pageCur]);

  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };

  const getList = async () => {
    const obj: any = {
      page: pageCur,
      size: pageSize,
      // sort_order: 'desc',
      // sort_field: 'created_at',
    };

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      // let result = await axios.get(`https://notion-api.splitbee.io/v1/table/73d83a0a-258d-4ac5-afa5-7a997114755a`);

      let result = await publicList(obj);

      const { rows, page, size, total } = result.data;

      setList(rows);
      setPageSize(size);
      setTotal(total);
      setPageCur(page);
    } catch (e: any) {
      logError(e);
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
    navigate(`/hubDetail/${id}`);
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
      <TopBox>
        <BackerNav title={t('apps.hub')} to={`/`} mb="20px" />
      </TopBox>
      <Box>
        {/*<FlexBox>*/}
        {/*  /!*<BackBox onClick={() => navigate(-1)}>*!/*/}
        {/*  /!*  <ChevronLeft className="iconTop" />*!/*/}
        {/*  /!*  <span>{t('general.back')}</span>*!/*/}
        {/*  /!*</BackBox>*!/*/}
        {/*  /!*<BackerNav title={t('general.back')}  mb="40px" />*!/*/}
        {/*  <div></div>*/}
        {/*  <Button onClick={() => window.open('https://tally.so/r/mDKbqb', '_target')}>{t('general.apply')}</Button>*/}
        {/*</FlexBox>*/}
        <UlBox>
          {list?.map((item: any, index) => (
            <li className="libox" key={index} onClick={() => ToGo(item.id)}>
              <InnerBox>
                <div className="imgBox">
                  <img src={item?.cover?.file?.url || item?.cover?.external.url} alt="" />
                </div>
                <ul className="btm">
                  <Tit>{item.properties['悬赏名称']?.title[0]?.plain_text}</Tit>
                  {item.properties['悬赏状态']?.select?.name && (
                    <li>
                      <TagBox className={returnStatus(item.properties['悬赏状态']?.select?.name)}>
                        {item.properties['悬赏状态']?.select?.name}
                      </TagBox>
                    </li>
                  )}
                  <li>
                    {!!item.properties['悬赏类型']?.multi_select?.length &&
                      (item.properties['悬赏类型']?.multi_select as any).map((innerItem: any, innerIndex: number) => (
                        <TypeBox key={`${index}_${innerIndex}`} className={returnColor(innerItem.name)}>
                          {innerItem?.name}
                        </TypeBox>
                      ))}
                  </li>
                  <li>招募截止时间：{item.properties['招募截止时间']?.rich_text[0]?.plain_text}</li>

                  <li className="line2">{item.properties['贡献报酬']?.rich_text[0]?.plain_text}</li>
                </ul>
              </InnerBox>
            </li>
          ))}
        </UlBox>
        {total > pageSize && (
          <div>
            <Page itemsPerPage={pageSize} total={total} current={pageCur - 1} handleToPage={handlePage} />
          </div>
        )}
      </Box>
    </PageStyle>
  );
}
