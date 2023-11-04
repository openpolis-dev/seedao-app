import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProjectById } from 'requests/project';
import { ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import Info from 'components/projectInfoCom/info';
import EditInfo from 'components/projectInfoCom/edit';
import BackIconSVG from 'components/svgs/back';

const OuterBox = styled.div`
  ${ContainerPadding};
  min-height: 100%;
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
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
`;

const BackBox = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  color: var(--bs-body-color);
`;

export default function InfoPage() {
  const { dispatch } = useAuthContext();

  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ReTurnProject | undefined>();

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
        <BackBox onClick={handleBack}>
          <BackIconSVG />
          <span>{detail?.name}</span>
        </BackBox>
        <Content>
          {isEdit ? (
            <EditInfo detail={detail} onUpdate={handleUpadte} />
          ) : (
            <Info detail={detail} onUpdate={handleUpadte} handleEdit={() => setIsEdit(true)} />
          )}
        </Content>
      </Box>
    </OuterBox>
  );
}
