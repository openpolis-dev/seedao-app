import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React, { useEffect, useState } from 'react';
import Project from 'pages/project';
import Guild from 'pages/guild';
import { useTranslation } from 'react-i18next';
import Tabbar from 'components/common/tabbar';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AddImg from '../../assets/Imgs/proposal/add-square.svg';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';

export default function ExplorePage() {
  const [search] = useSearchParams();
  const { t } = useTranslation();
  const [key, setKey] = useState(0);

  const canCreateProject = usePermission(PermissionAction.CreateApplication, PermissionObject.Project);

  const getContent = () => {
    switch (key) {
      case 0:
        return <Project />;
      case 1:
        return <Guild />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    const query_tab = search.get('tab');
    if (query_tab === 'guild') {
      setKey(1);
    } else {
      setKey(0);
    }
  }, [search]);

  return (
    <OuterBox>
      <TitBox>
        <Tabbar
          tabs={[
            { key: 0, title: t('menus.Project') },
            { key: 1, title: t('menus.Guild') },
          ]}
          defaultActiveKey={key}
          onSelect={(v: string | number) => setKey(v as number)}
        />
        {canCreateProject && (
          <Link to={key === 0 ? '/create-project' : '/create-guild'}>
            <Button>
              <img src={AddImg} alt="" className="mr20" />
              {key === 0 ? t('Project.create') : t('Guild.create')}
            </Button>
          </Link>
        )}
      </TitBox>
      {getContent()}
    </OuterBox>
  );
}

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .mr20 {
    margin-right: 10px;
  }
  .titLft {
    width: 100%;
  }
`;
