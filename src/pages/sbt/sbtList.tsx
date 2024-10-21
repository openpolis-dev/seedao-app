import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import { Button } from "react-bootstrap";
import ApplicationStatusTagNew from "../../components/common/applicationStatusTagNew";
import { useNavigate } from "react-router-dom";
import { PlainButton } from "../../components/common/button";

const Box = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;


const TopLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 16px;
  li {
    display: flex;
    align-items: center;
    .tit {
      padding-right: 20px;
      white-space: nowrap;
    }
  }
`;

const ExportButton = styled(PlainButton)`
  font-size: 14px;
  font-family: Poppins-Regular;
`;


export default function SbtList(){
  const { t } = useTranslation();
  const[list,setList]=useState([]);
  const navigate = useNavigate();

  const handleGoto = (url:string) =>{
    navigate(url);
  }

  return <Box>
    <TopLine>
      <li>
        <Button onClick={() => handleGoto("/sbt/create")} className="btn-com">
          {t("city-hall.SendCompleted")}
        </Button>
      </li>
      <li>
        <ExportButton onClick={() => handleGoto("/sbt/apply")}>{t("Project.Export")}</ExportButton>
      </li>
    </TopLine>
    <table className="table" cellPadding="0" cellSpacing="0">
      <thead>
      <tr>
        <th>{t("application.Receiver")}</th>
        <th className="right">{t('application.AddAssets')}</th>
        <th className="center">{t('application.Season')}</th>
        <th>{t('application.Content')}</th>
        <th>{t('application.BudgetSource')}</th>
        <th>{t('application.Auditor')}</th>
        <th className="center">{t('application.State')}</th>
        <th></th>
      </tr>
      </thead>

      <tbody>
        {/*{list.map((item:any) => (*/}
        {/*  <tr key={item.application_id}>*/}
        {/*    <td>{formatSNS(item.target_user_wallet.toLocaleLowerCase())}</td>*/}
        {/*    <td className="right">{item.asset_display}</td>*/}
        {/*    <td className="center">{item.season_name}</td>*/}
        {/*    <td>*/}
        {/*      <BudgetContent>{item.detailed_type}</BudgetContent>*/}
        {/*    </td>*/}
        {/*    <td>{item.budget_source}</td>*/}
        {/*    <td>{formatSNS(item.reviewer_wallet.toLocaleLowerCase())}</td>*/}
        {/*    <td className="center">*/}
        {/*      <ApplicationStatusTagNew status={item.status} />*/}
        {/*    </td>*/}
        {/*    <td className="center">*/}
        {/*      <MoreButton onClick={() => setDetailDisplay(item)}>{t('application.Detail')}</MoreButton>*/}
        {/*    </td>*/}
        {/*  </tr>*/}
        {/*))}*/}
      </tbody>
    </table>
  </Box>
}
