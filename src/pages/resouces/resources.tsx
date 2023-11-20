import styled from 'styled-components';
import { ContainerPadding } from '../../assets/styles/global';
import { useMemo, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import Links from 'utils/links';

import AppCard, { EmptyAppCard } from 'components/common/appCard';
import Tabbar from 'components/common/tabbar';
import { useAuthContext } from '../../providers/authProvider';
import { useNavigate } from 'react-router-dom';
import ResourcesDetail from './resources-detail';

const OuterBox = styled.div`
  min-height: 100%;
  position: relative;
  ${ContainerPadding};
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  color: var(--bs-body-color_active);
  .titLft {
    width: 100%;
  }
`;

const AppBox = styled(Row)`
  padding-bottom: 20px;

  div[class^='col'] {
    min-height: 96px;
    display: flex;
    margin-bottom: 24px;
  }
  .boxApp {
    align-items: flex-start;
    padding: 16px;
  }
  .iconBox {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
      background: #fff;
      width: 44px;
      height: 44px;
      border-radius: 8px;
    }
    img {
      width: 24px;
      height: 24px;
      border-radius: 8px;
    }
  }
`;

export default function Resources() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [type, setType] = useState('');

  const {
    state: { theme },
  } = useAuthContext();

  const resources = useMemo(() => {
    // @ts-ignore
    return Links.resource.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  const handleShow = (type: string) => {
    setShow(true);
    setType(type);
  };

  const closeModal = () => {
    setShow(false);
  };
  return (
    <OuterBox>
      {show && <ResourcesDetail closeModal={closeModal} id={type} />}
      <AppBox>
        {resources.map((item, idx) => (
          <Col key={idx} sm={12} md={6} lg={4} xl={3}>
            <AppCard {...item} handleShow={handleShow} />
          </Col>
        ))}
        {/*<div onClick={()=>ToGo()}>*/}
        {/*  test*/}
        {/*</div>*/}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard theme={theme} />
        </Col>
      </AppBox>
    </OuterBox>
  );
}
