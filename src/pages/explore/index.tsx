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
import { useAuthContext, AppActionType } from 'providers/authProvider';
import SearchWhite from 'assets/Imgs/light/search.svg';
import SearchImg from 'assets/Imgs/light/search.svg';
import sns from '@seedao/sns-js';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import ClearSVGIcon from 'components/svgs/clear';

export default function ExplorePage() {
  const [search] = useSearchParams();
  const { t } = useTranslation();
  const [key, setKey] = useState(0);
  const {
    state: { theme },
    dispatch,
  } = useAuthContext();

  const [walletSearchVal, setWalletSearchVal] = useState('');
  const [nameSearchVal, setNameSearchVal] = useState('');
  const [inputSearchVal, setInputSearchVal] = useState('');
  const [showInput, setShowInput] = useState(true);

  const { showToast } = useToast();
  const canCreateProject = usePermission(PermissionAction.CreateApplication, PermissionObject.Project);

  const getContent = () => {
    switch (key) {
      case 0:
        return <Project walletSearchVal={walletSearchVal} nameSearchVal={nameSearchVal} setShowInput={setShowInput} />;
      case 1:
        return <Guild walletSearchVal={walletSearchVal} nameSearchVal={nameSearchVal} setShowInput={setShowInput} />;
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

  const checkSearch = async () => {
    if (inputSearchVal.endsWith('.seedao')) {
      // sns
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      try {
        const w = await sns.resolve(inputSearchVal);
        if (w && w !== ethers.constants.AddressZero) {
          setWalletSearchVal(w?.toLocaleLowerCase());
        } else {
          showToast(t('Msg.SnsNotFound', { sns: inputSearchVal }), ToastType.Danger);
        }
      } catch (error) {
        console.error(error);
        showToast('parse SNS error', ToastType.Danger);
      } finally {
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
      }
    } else if (ethers.utils.isAddress(inputSearchVal)) {
      // address
      setWalletSearchVal(inputSearchVal?.toLocaleLowerCase());
    } else if (inputSearchVal) {
      setNameSearchVal(inputSearchVal);
    } else {
      setNameSearchVal(inputSearchVal);
      setWalletSearchVal(inputSearchVal);
    }
  };

  const onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      checkSearch();
    }
  };

  const clearSearch = () => {
    setInputSearchVal('');
    setNameSearchVal('');
    setWalletSearchVal('');
  };

  return (
    <OuterBox>
      <TitBox>
        <Tabbar
          tabs={[
            { key: 0, title: t('menus.Project') },
            { key: 1, title: t('menus.Guild') },
          ]}
          defaultActiveKey={key}
          onSelect={(v: string | number) => {
            setKey(v as number);
            clearSearch();
          }}
        />
        <TitRight>
          <SearchBox style={{ visibility: showInput ? 'visible' : 'hidden' }}>
            <img src={theme ? SearchWhite : SearchImg} alt="" />
            <input
              type="text"
              placeholder={t('Msg.SearchHint', { type: key === 0 ? t('menus.Project') : t('menus.Guild') })}
              onKeyUp={onKeyUp}
              value={inputSearchVal}
              onChange={(e) => setInputSearchVal(e.target.value)}
            />
            {inputSearchVal && <ClearSVGIcon onClick={clearSearch} />}
          </SearchBox>

          {canCreateProject && (
            <Link to={key === 0 ? '/create-project' : '/create-guild'}>
              <Button>
                <img src={AddImg} alt="" className="mr20" />
                {key === 0 ? t('Project.create') : t('Guild.create')}
              </Button>
            </Link>
          )}
        </TitRight>
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

const TitRight = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-left: 20px;
`;

const SearchBox = styled.div`
  width: 260px;
  height: 40px;
  background: var(--bs-box-background);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  border: 1px solid var(--bs-border-color);
  font-size: 14px;
  input {
    width: calc(100% - 40px);
    border: 0;
    background: transparent;
    margin-left: 9px;
    height: 24px;
    &::placeholder {
      color: var(--bs-body-color);
    }
    &:focus {
      outline: none;
    }
  }
  svg {
    cursor: pointer;
  }
`;
