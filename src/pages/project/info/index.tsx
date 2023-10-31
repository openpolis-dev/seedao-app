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
`;

const Content = styled.div`
  box-sizing: border-box;
`;

const BackBox = styled.div`
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
    try {
      const dt = await getProjectById(id as string);
      setDetail(dt.data);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const handleBack = () => {
    isEdit ? setIsEdit(false) : navigate(-1);
  };

  const handleUpadte = () => {
    setIsEdit(false);
    getDetail();
  };

  return (
    <OuterBox>
      <Box>
        <BackBox>
          <ChevronLeft className="back" onClick={handleBack} />
          <div>
            <span>{detail?.name}</span>
            {canAuditApplication && !isEdit && <PencilSquare onClick={() => setIsEdit(true)} className="edit" />}
          </div>
        </BackBox>
        <Content>
          {isEdit ? (
            <EditInfo detail={detail} onUpdate={handleUpadte} />
          ) : (
            <Info detail={detail} onUpdate={handleUpadte} />
          )}
        </Content>
      </Box>
    </OuterBox>
  );
}
