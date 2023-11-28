import styled from 'styled-components';
import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';
import { useAuthContext } from 'providers/authProvider';

const AppBox = styled(Row)`
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

const AppCardBox = (props: { children: React.ReactNode }) => {
  return (
    <Col sm={12} md={6} lg={4} xl={3}>
      {props.children}
    </Col>
  );
};

const BtmBox = styled.div`
  margin-top: 40px;
  border-top: 1px solid var(--bs-border-color);
  padding-top: 40px;
`;

const LiBox = styled(Col)`
  width: 181px;
  height: 160px;
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  border-radius: 16px;
  border: 1px solid var(--border-box);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
  .name {
    font-size: 16px;
    font-weight: 600;
    color: var(--bs-body-color_active);
    line-height: 22px;
    text-align: center;
  }
  img {
    width: 28px;
    height: 28px;
    object-fit: cover;
    object-position: center;
    margin-bottom: 18px;
  }
`;

export default function GovernancePage() {
  const { t } = useTranslation();
  const {
    state: { theme },
  } = useAuthContext();

  const lst = useMemo(() => {
    // @ts-ignore
    return Links.governance.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  const BList = useMemo(() => {
    // @ts-ignore
    return Links.governanceBtm.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  return (
    <div>
      <AppBox>
        {lst.map((app, i) => (
          <AppCardBox key={i}>
            <AppCard {...app} />
          </AppCardBox>
        ))}
        {/*<AppCardBox>*/}
        {/*  <EmptyAppCard theme={theme} />*/}
        {/*</AppCardBox>*/}
      </AppBox>
      <BtmBox>
        <Row>
          {BList.map((item, index) => (
            <LiBox md={2} key={`gBtm_${index}`}>
              <div>
                <img src={item.icon} alt="" />
              </div>
              <div className="name">{item.name}</div>
            </LiBox>
          ))}
        </Row>
      </BtmBox>
    </div>
  );
}
