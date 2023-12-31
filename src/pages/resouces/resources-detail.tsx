import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import { useParams } from 'react-router-dom';
import TallyForm from './tallyForm';
import Links from '../../utils/links';
import { useAuthContext } from '../../providers/authProvider';
// import BackerNav from '../../components/common/backNav';
// import useParseSNS from '../../hooks/useParseSNS';
import { X } from 'react-bootstrap-icons';
import CloseImg from '../../assets/Imgs/dark/close-circle.svg';
import CloseImgLight from '../../assets/Imgs/light/close-circle.svg';

const Box = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-right: 20px;
  }
`;

const BoxOuter = styled.div`
  background: #fff;
  width: 80vw;
  height: 80vh;
  position: relative;
  border-radius: 16px;
`;

const BoxInner = styled.div`
  height: 100%;
  box-sizing: border-box;
  //padding: 40px;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 16px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }

  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    background: var(--bs-box-background);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
  }
`;

interface Iprops {
  closeModal: () => void;
  id: string;
}

export default function ResourcesDetail(props: Iprops) {
  // const { id } = useParams();
  const { closeModal, id } = props;
  const [item, setItem] = useState<any>();

  const {
    state: { userData, account, theme },
  } = useAuthContext();

  const getDetail = () => {
    let arr = Links.resource.filter((item) => item.link.indexOf(id!) > -1);
    if (arr.length) {
      setItem(arr);
    }
  };

  useEffect(() => {
    if (!id) return;
    getDetail();
  }, [id]);
  return (
    <Box>
      <BoxOuter>
        <BoxInner>
          <div className="icon-close" onClick={() => closeModal()}>
            {/*<EvaIcon name="close-outline" />*/}
            {/*<X />*/}
            <img src={theme ? CloseImg : CloseImgLight} alt="" />
          </div>
          <TallyForm id={id} item={item} userData={userData} account={account} />
        </BoxInner>
      </BoxOuter>

      {/*<LftBox>*/}
      {/*  <BackerNav title={item?.name || ''} to="/resources" mb="40px" />*/}
      {/*</LftBox>*/}

      {/*{!!account && <TallyForm id={id} item={item} userData={userData} account={account} />}*/}
    </Box>
  );
}
