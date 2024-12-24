import styled from "styled-components";
import LinkImg from "../../assets/Imgs/link.svg";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import DefaultAvatarIcon from "../../assets/Imgs/defaultAvatar.png";
import { formatTime } from "../../utils/time";
import {Trash2, Pencil} from "lucide-react";
import ConfirmModal from "../../components/modals/confirmModal";
import { useTranslation } from "react-i18next";
import DetailModal from "./detail";
import { deletePublicity, getPublicity } from "../../requests/publicity";
import Pagination from "../../components/pagination";
import NoItem from "../../components/noItem";
import publicJs from "../../utils/publicJs";
import useQuerySNS from "../../hooks/useQuerySNS";
import useToast, { ToastType } from "../../hooks/useToast";
import { AppActionType, useAuthContext } from "../../providers/authProvider";

const Box = styled.div`
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

const TopLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 16px;
    margin-top: -40px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;

const ExportButton = styled(Button)`
  font-size: 14px;
  font-family: Poppins-Regular;
    min-width: 120px;
`;

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

export default function Publicity(){
  const { getMultiSNS } = useQuerySNS();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toBeDeleteId, setTobeDeletedId] = useState<number>();
  const [show,setShow] = useState<boolean>(false);
  const [page,setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [total,setTotal] = useState<number>(10);
  const [list,setList] = useState([]);
  const [detailId, setDetailId] = useState<number>();

  const { dispatch} = useAuthContext();
  const { showToast } = useToast();

  const [snsMap, setSnsMap] = useState<Map<string, string>>(new Map());
  const handleCreate = () =>{
    navigate("/city-hall/publicity/create")
  }

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
    let rt = await getPublicity(page,size)
    const {data:{page:pg,rows,total}} = rt;
    setPage(pg)
    setTotal(total)
    setList(rows)

    handleSNS(rows.filter((d:any) => !!d.creator).map((d:any) => d.creator));
  }

  const onDelete = (id: number) => {
    setTobeDeletedId(Number(id));
  };

  const handleDeletePost = async() =>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{

      let rt = await deletePublicity(toBeDeleteId!)
    }catch(error:any){
      showToast(error?.response?.data?.message || error, ToastType.Danger);
      console.error(error)
    }finally {
      setShow(false)
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
      setTimeout(()=>{
        window.location.reload();
      },2000)
    }
  }

  const handleDetail = (id:number) =>{
    setShow(true)
    setDetailId(Number(id));
  }

  const closeDetail = ()  =>{
    setShow(false)
  }

  const formatSNS = (wl: string) => {
    const wallet = wl.toLowerCase();
    const name = snsMap.get(wallet) || wallet;
    return name?.endsWith('.seedao') ? name : publicJs.AddressToShow(name, 4);
  };

  return <Box>
    <TopLine>
      <li>
        <ExportButton onClick={()=>handleCreate()}>创建</ExportButton>
      </li>
    </TopLine>
    {
      show &&<DetailModal handleClose={closeDetail} id={detailId!}/>
    }
    {toBeDeleteId && (
      <ConfirmModal
        msg={t('city-hall.ConfirmDelete')}
        onClose={() => {
          setTobeDeletedId(undefined);
          // setCurrentBindIdx(undefined);
        }}
        onConfirm={handleDeletePost}
      />
    )}
    {
      !list?.length && <NoItem />
    }
    {
     !!list?.length &&  list.map((item:any, index) => (
        <LinkBox key={index}>
          <CardBox>
          <CardHeaderStyled>
              <Title>{item?.title}</Title>
            </CardHeaderStyled>
            <CardBody>
              <AvaBox>
                {/*<div className="left">*/}
                {/*  <UserAvatar src={DefaultAvatarIcon} alt="" />*/}
                {/*</div>*/}
                <div className="right">
                  <div className="name">{formatSNS(item.creator)}</div>
                  <div className="date">{formatTime(item?.createAt * 1000)}</div>
                </div>
              </AvaBox>
              <TagsBox>
                <Link to={`/city-hall/publicity/edit/${item?.id}`}>
                  <Pencil size={16} />
                </Link>
                <div onClick={() => onDelete(item?.id)}>
                  <Trash2 size={16} color="#eb5757" />
                </div>

                <div onClick={() => handleDetail(item?.id)}>
                  <img src={LinkImg} alt="" />
                </div>
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


  </Box>
}
