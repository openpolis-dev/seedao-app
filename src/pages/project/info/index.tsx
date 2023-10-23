import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProjectById } from 'requests/project';
import { ReTurnProject } from 'type/project.type';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, PencilSquare } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import Info from 'components/projectInfoCom/info';
import EditInfo from 'components/projectInfoCom/edit';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
  @media (max-width: 1024px) {
    .nav {
      flex-wrap: nowrap;
    }
    .nav-item {
      white-space: nowrap;
    }
  }
`;

const Box = styled.div`
  position: relative;
  min-height: 100%;
  background: #fff;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 20px;
`;

const BackBox = styled.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  .back {
    margin-right: 10px;
    cursor: pointer;
  }
  .edit {
    margin-left: 10px;
    cursor: pointer;
  }
`;

export default function InfoPage() {
  const { t } = useTranslation();

  const { dispatch } = useAuthContext();

  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ReTurnProject | undefined>();

  const canAuditApplication = usePermission(PermissionAction.CreateApplication, PermissionObject.ProjPrefix + id);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    id && getDetail();
  }, [id]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getProjectById(id as string);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setDetail(dt.data);
  };

  const handleBack = () => {
    isEdit ? setIsEdit(false) : navigate(-1);
  };

  const handleUpadte = () => {
    // TODO get info
    setIsEdit(false);
  };

  return (
    <OuterBox>
      <Box>
        <BackBox>
          <ChevronLeft className="back" onClick={handleBack} />
          <div>
            <span>{detail?.name}</span>
            {canAuditApplication && <PencilSquare onClick={() => setIsEdit(true)} className="edit" />}
          </div>
        </BackBox>
        <Content>{isEdit ? <EditInfo detail={detail} onUpdate={handleUpadte} /> : <Info detail={detail} />}</Content>
      </Box>
    </OuterBox>
  );
}
