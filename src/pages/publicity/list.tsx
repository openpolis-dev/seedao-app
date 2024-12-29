import styled from "styled-components";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';

import { formatTime } from "../../utils/time";

import { useTranslation } from "react-i18next";

import { getPublicity } from "../../requests/publicity";
import Pagination from "../../components/pagination";
import NoItem from "../../components/noItem";
import publicJs from "../../utils/publicJs";
import useQuerySNS from "../../hooks/useQuerySNS";

import { ContainerPadding } from "../../assets/styles/global";
import Tabbar from "../../components/common/tabbar";
import defaultImg from "../../assets/Imgs/defaultAvatar.png";

const Page = styled.div`
    ${ContainerPadding};
`;

const TopLine = styled.div`
  padding-bottom: 20px;
`

const CardBox = styled.div`
  box-shadow: var(--proposal-box-shadow);
  border: 1px solid var(--proposal-border);
  //cursor: pointer;
  //background: var(--bs-box-background);
  background: transparent;
  padding: 16px 24px;
  border-radius: 16px;
    display: flex;
    flex-direction: column;
    //align-items: center;
    //justify-content: space-between;

  .name {
    font-size: 16px;
    color: var(--bs-body-color_active);
    line-height: 1em;
  }

  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  font-family: Poppins-SemiBold, Poppins;
  color: var(--bs-body-color_active);
`;

const LinkBox = styled.div`
    background: var(--bs-box-background);
    display: inline-block;
    width: 100%;
    margin-bottom: 16px;
    border-radius: 16px;
    &:hover {
        background-color: var(--home-right_hover);
    }
`




const CardBody = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 16px;
`;

const UserAvatar = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`;

const AvaBox = styled.div`
  display: flex;
  align-items: center;
  .left {
    margin-right: 10px;
  }

  .right {
    .name {
      font-size: 14px;
    }
    .date {
      line-height: 18px;
      margin-top: 4px;
    }
  }
`;

const TagsBox = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
    & >div{
        cursor: pointer;
    }
`;

const InnerBox = styled.div`
  margin-top: 10px;
    font-size: 14px;
    background: rgb(36, 175, 255);
    color: #fff;
    display: inline-block;
    padding: 3px 5px;
    border-radius: 4px;
`

const FlexLine = styled.div`
  margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
`


export default function PublicityList(){
  const { getMultiSNS } = useQuerySNS();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page,setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [total,setTotal] = useState<number>(10);
  const [list,setList] = useState([]);


  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());

  const handleSNS = async (wallets: string[]) => {
    const sns_map = await getMultiSNS(wallets);
    setSnsMap(sns_map);
  };

  useEffect(() => {
    getList()
  }, [page]);

  const go2page = (_page: number) => {
    setPage(_page + 1);
  };

  const getList = async() =>{
    let rt = await getPublicity(page,size,"list")
    const {data:{page:pg,rows,total}} = rt;
    setPage(pg)
    setTotal(total)
    setList(rows)

    handleSNS(rows.filter((d:any) => !!d.creator).map((d:any) => d.creator));
  }



  const handleDetail = (id:number) =>{

    // setDetailId(Number(id));
    navigate("/publicity/detail/"+id);
  }


  const formatSNS = (wl: string) => {
    const wallet = wl.toLowerCase();
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  return <Page>
    <TopLine>
      <Tabbar
        tabs={[
          { key: 0, title: t('Home.information') },
        ]}
        defaultActiveKey={0}
      />
    </TopLine>


    {
      !list?.length && <NoItem />
    }
    {
      !!list?.length &&  list.map((item:any, index) => (
        <LinkBox key={index} onClick={()=>handleDetail(item?.id)}>
          <CardBox>
            <CardHeaderStyled>
              <Title>{item?.title}</Title>
            </CardHeaderStyled>
            <FlexLine>
              <InnerBox>
                S{item?.season}{t("city-hall.CityHallMembers")}
              </InnerBox>
            </FlexLine>
            <CardBody>
              <AvaBox>
                <div className="left">
                  <UserAvatar src={item.avatar || defaultImg} alt="" />
                </div>
                <div className="right">
                  <div className="name">{formatSNS(item.creator)}</div>
                  <div className="date">{formatTime(item?.updateAt * 1000)}</div>
                </div>
              </AvaBox>
              <TagsBox>

              {/*  <Link to={`/city-hall/publicity/edit/${item?.id}`}>*/}
              {/*    <Pencil size={16} />*/}
              {/*  </Link>*/}
              {/*  <div onClick={() => onDelete(item?.id)}>*/}
              {/*    <Trash2 size={16} color="#eb5757" />*/}
              {/*  </div>*/}

              {/*  <div onClick={() => handleDetail(item?.id)}>*/}
              {/*    <img src={LinkImg} alt="" />*/}
              {/*  </div>*/}
              </TagsBox>
            </CardBody>

          </CardBox>
        </LinkBox>

      ))
    }

    {
      list.length > 1 && <div>
        <Pagination itemsPerPage={size} total={total} current={page - 1} handleToPage={go2page} />
      </div>
    }


  </Page>
}
