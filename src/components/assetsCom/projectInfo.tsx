import styled from 'styled-components';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import React, { useEffect, useState } from 'react';
import { getProjectById } from '../../requests/project';
import DefaultLogo from '../../assets/Imgs/defaultLogo.png';
import CategoryTag, { formatCategory } from '../proposalCom/categoryTag';
import { useTranslation } from 'react-i18next';
import { ProjectStatus } from '../../type/project.type';

const Box = styled.div`
  background: var(--bs-box-background);
  padding: 30px 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 40px;
  box-shadow: var(--box-shadow);
`;

const ImgBox = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
`;
const MidBox = styled.div`
  width: 65%;
  @media (max-width: 1600px) {
    width: 100%;
  }
`;
const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  .title {
    //color: #29282F;
    color: var(--bs-body-color_active);
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  }
  .rhtLine {
    display: flex;
    gap: 10px;
  }
  .tag {
    min-width: 80px;
    height: 24px;
    line-height: 22px;
    border: 1px solid #0085ff;
    text-align: center;
    color: #0085ff;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 12px;
  }
  .cat {
    color: var(--bs-body-color_active);
    border: 1px solid #9ca4ab;
    background: rgba(217, 217, 217, 0.27);
  }
  .status {
    border: 1px solid #5200ff;
    background: #5200ff;
    color: #fff;
  }
`;

const UlBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--menu-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  flex-wrap: wrap;
  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .lft {
    margin-right: 20px;
  }
  .tit {
    white-space: nowrap;
  }
  .rht {
    & > div {
      white-space: nowrap;
    }
  }
`;

const TipsBox = styled.div`
  color: #5200ff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.07px;
`;

const StatusBox = styled.div`
  font-size: 12px;
  color: #fff;
  background: var(--bs-primary);
  padding: 2px 12px;
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

export default function ProjectInfo({ detail }: any) {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();

  const showStatusComponent = () => {
    switch (detail?.status) {
      case ProjectStatus.Closed:
        return <StatusBox className="close">{t('Project.Closed')}</StatusBox>;
      case ProjectStatus.Open:
        return <StatusBox>{t('Project.Open')}</StatusBox>;
      case ProjectStatus.Closing:
        return <StatusBox>{t('Project.Closing')}</StatusBox>;
      case ProjectStatus.CloseFailed:
        return <StatusBox className="close-failed">{t('Project.CloseFailed')}</StatusBox>;
    }
  };

  return (
    <>
      {!!detail && (
        <Box>
          <ImgBox>
            <img src={detail?.logo || DefaultLogo} alt="" />
          </ImgBox>
          <MidBox>
            <FlexBox>
              <div className="title">{detail?.name}</div>
              <div className="rhtLine">
                {detail?.SIP && <div className="tag">SIP - {detail?.SIP}</div>}
                {detail?.Category && <div className="tag cat">{formatCategory(detail?.Category)} </div>}
                {showStatusComponent()}
              </div>
            </FlexBox>
            <UlBox>
              <li>
                <div className="lft">
                  <div className="tit">{t('Project.projectBudget')}</div>
                  <div className="tit">{t('Project.CurrentlyPrepaid')}</div>
                </div>
                <div className="rht">
                  {/*项目预算*/}
                  <div>{detail?.total}</div>
                  {/*当前已预支*/}
                  <div>{detail?.paid}</div>
                </div>
              </li>
              <li>
                <div className="lft">
                  <div className="tit">{t('Project.PrepayRatio')}</div>
                  <div className="tit">{t('Project.BudgetBalance')}</div>
                </div>
                <div className="rht">
                  {/*预付比例*/}
                  <div>{detail?.ratio}</div>
                  {/*预算余额*/}
                  <div>{detail?.remainAmount}</div>
                </div>
              </li>

              <li>
                <div className="lft">
                  <div className="tit">{t('Project.AvailableAmount')}</div>
                  <div className="tit">{t('Project.AvailableBalance')}</div>
                </div>
                <div className="rht">
                  {/*总可预支*/}
                  <div>{detail?.prepayTotal}</div>
                  {/*可预支余额*/}
                  <div>{detail?.prepayRemain}</div>
                </div>
              </li>
            </UlBox>
            <TipsBox>{t('Project.tips')}</TipsBox>
          </MidBox>
        </Box>
      )}
    </>
  );
}
