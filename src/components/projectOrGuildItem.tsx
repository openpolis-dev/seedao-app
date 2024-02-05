import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import DefaultLogo from 'assets/Imgs/defaultLogo.png';
import ProposalStateTag from './proposalCom/stateTag';
import { ProposalState } from '../type/proposalV2.type';

const Box = styled.div`
  width: 20%;
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
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 8px;
  }
`;
const CardBox = styled.div`
  margin-bottom: 24px;
  box-sizing: border-box;
  border-radius: 16px;
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow) !important;
  padding: 14px;
  height: 220px;
  position: relative;
  &:hover {
    background: var(--home-right_hover);
  }
`;

const TagBox = styled.div`
  position: absolute;
  right: 10px;
`;

const ImageBox = styled.div`
  width: 100%;
  img {
    width: 68px;
    height: 68px;
    border-radius: 16px;
    object-fit: cover;
    object-position: center;
  }
`;

const Desc = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  min-height: 36px;
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

interface Iprops {
  data: {
    id: number;
    logo: string;
    name: string;
    intro: string;
    desc: string;
    members: string[];
    sponsors: string[];
  };
  onClickItem: (id: number) => void;
}

export default function ProjectOrGuildItem({ data, onClickItem }: Iprops) {
  const { t } = useTranslation();
  return (
    <Box>
      <CardBox>
        <TagBox>
          <ProposalStateTag state={ProposalState.Approved} />
        </TagBox>
        <Item onClick={() => onClickItem(data.id)}>
          <ImageBox>
            <img src={data.logo || DefaultLogo} alt="" />
          </ImageBox>
          <div className="title">{data.name}</div>
          <Desc>{data.desc ? data.desc : t('Project.ProjectOrGuildItem')}</Desc>
          <MemBox>
            <Avatar>
              <img
                src="https://seedao-os-superapp.s3.ap-northeast-2.amazonaws.com/user_avatars/0x4d4b78D37090eD3e1EAe6779bA2C3D6728052915_1704533838252.jpg"
                alt=""
              />
            </Avatar>
            <span>wendychaung.seedao</span>
            {/*<span>{(data?.members?.length || 0) + (data?.sponsors?.length || 0)}</span> {t('Project.Members')}*/}
          </MemBox>
        </Item>
      </CardBox>
    </Box>
  );
}
