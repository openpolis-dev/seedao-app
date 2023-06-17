import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { useEffect, useState } from 'react';
import PropsalModal from 'components/projectInfoCom/propsalModal';
import { ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import useTranslation from 'hooks/useTranslation';
import NoItem from 'components/noItem';

const Box = styled.div`
  padding: 20px 0;
`;

const UlBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    border: 1px solid #eee;
    width: 49%;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .fst {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 10px;
    }
    .tit {
      font-weight: bold;
      font-size: 16px;
    }
    .date {
      font-size: 12px;
    }
  }
`;
const TitleBox = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
`;
const TopBox = styled.div`
  background: #f8f8f8;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;

const DescBox = styled.div`
  font-size: 12px;
`;

interface Iprops {
  detail: ReTurnProject | undefined;
}
export default function ProjectProposal(props: Iprops) {
  const { detail } = props;
  const router = useRouter();
  const { id } = router.query;
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!id || !detail) return;
    getDetail();
  }, [id, detail]);

  const getDetail = async () => {
    const { proposals } = detail!;
    setList(proposals);
  };

  const handleModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
  };

  return (
    <Box>
      {show && <PropsalModal closeModal={closeModal} />}

      <TopBox>
        <Button> {t('Project.createProposal')}</Button>
        <Button appearance="outline" onClick={() => handleModal()}>
          {t('Project.AssociatedProposal')}
        </Button>
      </TopBox>
      <UlBox>
        {list.map((item, index) => (
          <li key={index}>
            <div className="fst">
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <div className="tit">dfafd</div>
                <div className="date">May 19,2024</div>
              </div>
            </div>
            <TitleBox> SIP-79：共同打造中文web3媒体</TitleBox>
            <DescBox>
              展示正文内容中前两行的内容展示正文内容中前两行的内容展示正文内容中前两行的内容展示正文内容中前两行的内容展示正文内容中前两行的内容展示正文内容中前两行的内容
            </DescBox>
          </li>
        ))}
      </UlBox>
      {!list.length && <NoItem />}
    </Box>
  );
}
