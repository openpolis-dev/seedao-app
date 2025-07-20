import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import DefaultLogo from 'assets/Imgs/defaultLogo.png';
import ProposalStateTag from './proposalCom/stateTag';
import { ProposalState } from '../type/proposalV2.type';
import publicJs from '../utils/publicJs';
import { ProjectStatus } from '../type/project.type';
import DefaultAvatar from '../assets/Imgs/defaultAvatarT.png';

const Box = styled.div`
  width: 33%;
  height: 100%;
  padding-right: 1%;
  &:last-child {
    margin-right: auto;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  .title {
    padding-top: 9px;
    font-size: 16px;
    font-family: Poppins-SemiBold;
    font-weight: 600;
    color: var(--font-color-title);
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin-bottom: 8px;
  }
`;
const CardBox = styled.div`
  margin-bottom: 15px;
  box-sizing: border-box;
  border-radius: 16px;
    background-color: var(--bs-box--background);
    border: 1px solid var(--bs-border-color);
    box-shadow: var(--box-shadow);
  padding: 14px;
  height: 165px;
  position: relative;
  &:hover {
    background: var(--home-right_hover);
  }
`;

const TagBox = styled.div`
  position: absolute;
  right: 10px;
    bottom: 16px;
`;

const ImageBox = styled.div`
  img {
    width: 68px;
    height: 68px;
    border-radius: 16px;
    object-fit: cover;
    object-position: center;
  }
`;

const Desc = styled.div`
  //overflow: hidden;
  //text-overflow: ellipsis;
  //display: -webkit-box;
  //-webkit-line-clamp: 1;
  //-webkit-box-orient: vertical;
    margin-top: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  min-height: 18px;
`;

const MemBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: var(--font-color-title);
  line-height: 18px;
  margin-bottom: 10px;
  gap: 10px;

  //span {
  //  margin-right: 5px;
  //}
`;

const Avatar = styled.div`
  img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    object-position: center;
    border-radius: 100%;
  }
`;

const StatusBox = styled.div`
  font-size: 12px;
  color: #fff;
  background: var(--bs-primary);
  padding: 2px 8px;
  border-radius: 4px;
  line-height: 22px;
  height: 26px;
  &.pending_close {
    background: #f9b617;
  }
  &.close {
    background: rgb(163, 160, 160);
  }
  &.close-failed {
    background: rgb(255, 51, 51);
  }
`;
const ItemTop = styled.div`
  display: flex;
    gap:10px;
`

interface Iprops {
  data: {
    id: number;
    logo: string;
    name: string;
    intro: string;
    desc: string;
    status?: string;
    members: string[];
    sponsors: string[];
    user?: any;
    sns?: string;
  };

  noTag?: boolean;
  onClickItem: (id: number) => void;
}

export default function ProjectOrGuildItem({ data, onClickItem, noTag }: Iprops) {
  const { t } = useTranslation();
  const showStatusComponent = () => {
    switch (data?.status) {
      case ProjectStatus.Closed:
        return <StatusBox className="close">{t('Project.Closed')}</StatusBox>;
      case ProjectStatus.Open:
        return <StatusBox >{t('Project.Open')}</StatusBox>;
      case ProjectStatus.Closing:
        return <StatusBox>{t('Project.Closing')}</StatusBox>;
      case ProjectStatus.CloseFailed:
        return <StatusBox className="close-failed">{t('Project.CloseFailed')}</StatusBox>;
    }
  };

  const formatContent = (html: string) => {
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(/<[^>]*>/g, '');
    return html;
  };
  return (
    <Box>
      <CardBox>
        {!noTag && <TagBox>{showStatusComponent()}</TagBox>}

        <Item onClick={() => onClickItem(data.id)}>
          <ItemTop>
            <ImageBox>
              <img src={data.logo || DefaultLogo} alt="" />
            </ImageBox>
            <div className="title">{data.name}</div>
          </ItemTop>

          <Desc>{data.desc ? formatContent(data.desc) : t('Project.ProjectOrGuildItem')}</Desc>
          {!!data.user && (
            <MemBox>
              <Avatar>
                <img src={data.user?.avatar ? data.user?.avatar : DefaultAvatar} alt="" />
              </Avatar>
              <span>{data.sns?.endsWith('.seedao') ? data.sns : publicJs.AddressToShow(data.user?.wallet)}</span>
              {/*<span>{(data?.members?.length || 0) + (data?.sponsors?.length || 0)}</span> {t('Project.Members')}*/}
            </MemBox>
          )}
        </Item>
      </CardBox>
    </Box>
  );
}
