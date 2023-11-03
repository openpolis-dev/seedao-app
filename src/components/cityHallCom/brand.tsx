import styled from 'styled-components';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';

const AppBox = styled(Row)`
  padding-inline: 20px;
  padding-top: 10px;
`;

export default function BrandPanel() {
  const { t } = useTranslation();

  const lst = useMemo(() => {
    // @ts-ignore
    return Links.brand.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);
  return (
    <div>
      <AppBox>
        {lst.map((app, i) => (
          <Col sm={12} md={6} lg={4} xl={3} key={i}>
            <AppCard {...app} />
          </Col>
        ))}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard />
        </Col>
      </AppBox>
    </div>
  );
}
