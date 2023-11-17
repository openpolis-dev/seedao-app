import styled from 'styled-components';
import { EventDetail } from 'seeucomp';
import { ContainerPadding } from 'assets/styles/global';
import React, { useEffect, useState } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { getSeeuEventDetail } from 'requests/event';
import BackerNav from '../../components/common/backNav';

export default function EventDetailPage() {
  const { search } = window.location;
  const id = new URLSearchParams(search).get('id');
  const { showToast } = useToast();

  const [data, setData] = useState();
  const { dispatch } = useAuthContext();
  useEffect(() => {
    const getDetail = async () => {
      if (!id) {
        return;
      }
      try {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        const resp = await getSeeuEventDetail(id);
        setData(resp.data);
      } catch (error: any) {
        console.error(error);
        showToast(error, ToastType.Danger);
      } finally {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      }
    };
    getDetail();
  }, [id]);
  return (
    <OuterBox>
      <BackerNav title={''} to="/explore?tab=project" mb="40px" />
      {data && <EventDetail item={data} />}
    </OuterBox>
  );
}

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};

  .eventDetail {
    color: var(--bs-body-color_active);
    img {
      max-width: 100%;
    }
    p {
      margin-block: 10px;
    }
    & > div:first-child {
      gap: 30px;
      img {
        width: unset;
        max-width: 500px;
      }
      & > div:first-child {
        flex: unset !important;
        width: unset !important;
      }
      @media (max-width: 750px) {
        flex-direction: column;
      }
    }
    .meetDetailBlock {
      margin-block: 10px;
      padding: 10px 0 0;
      border-top: 1px solid rgb(51, 51, 51);
      dl {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        dt {
          margin-bottom: 6px;
        }
        dd {
          line-height: 26px;
        }
      }
    }
  }
`;
