import styled from "styled-components";
import LinkImg from "../../assets/Imgs/link.svg";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import DefaultAvatarIcon from "../../assets/Imgs/defaultAvatar.png";
import { formatTime } from "../../utils/time";
import {Trash2, Pencil} from "lucide-react";
import ConfirmModal from "../../components/modals/confirmModal";
import { useTranslation } from "react-i18next";
import DetailModal from "./detail";

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

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [toBeDeleteId, setTobeDeletedId] = useState<number>();
  const [show,setShow] = useState<boolean>(false);
  const handleCreate = () =>{
    navigate("/city-hall/publicity/create")
  }

  const onDelete = (id: number) => {
    setTobeDeletedId(id);
  };

  const handleDeletePost = () =>{

  }

  const handleDetail = () =>{
    setShow(true)
  }

  const closeDetail = ()  =>{
    setShow(false)
  }

  return <Box>
    <TopLine>
      <li>
        <ExportButton onClick={()=>handleCreate()}>创建</ExportButton>
      </li>
    </TopLine>
    {
      show &&<DetailModal handleClose={closeDetail}/>
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
      [...Array(20)].map((item, index) => (
        <LinkBox>
          <CardBox>
          <CardHeaderStyled>
              <Title>当季SeeDAO社区治理节点名单</Title>
            </CardHeaderStyled>
            <CardBody>
              <AvaBox>
                <div className="left">
                  <UserAvatar src={DefaultAvatarIcon} alt="" />
                </div>
                <div className="right">
                  <div className="name">wendychaung.seedao</div>
                  <div className="date">{formatTime(1734704930000)}</div>
                </div>
              </AvaBox>
              <TagsBox>
                <Link to="/city-hall/publicity/edit/123">
                  <Pencil size={16} />
                </Link>
                <div onClick={() => onDelete(1)}>
                  <Trash2 size={16} color="#eb5757" />
                </div>

                <div onClick={() => handleDetail()}>
                  <img src={LinkImg} alt="" />
                </div>
              </TagsBox>
            </CardBody>

          </CardBox>
        </LinkBox>

      ))
    }
  </Box>
}
