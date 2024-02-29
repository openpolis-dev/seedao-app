import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IGuildDisplay, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';

import { getProjectById } from 'requests/guild';

import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useLocation, useParams } from 'react-router-dom';
import EditGuild from 'components/guild/edit';

export default function EditPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const { dispatch } = useAuthContext();
  const [detail, setDetail] = useState<IGuildDisplay>();

  useEffect(() => {
    const getDetail = async () => {
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      try {
        const dt = await getProjectById(id as string);
        setDetail(dt.data);
      } catch (error) {
        logError(error);
      } finally {
        dispatch({ type: AppActionType.SET_LOADING, payload: null });
      }
    };
    if (state) {
      setDetail(state);
    } else {
      getDetail();
    }
  }, [state, id]);
  return (
    <OuterBox>
      <Box>
        <BackerNav title={detail?.name || ''} to={`/guild/info/${detail?.id}`} mb="40px" />
        <Content>
          <EditGuild detail={detail} />
        </Content>
      </Box>
    </OuterBox>
  );
}

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
