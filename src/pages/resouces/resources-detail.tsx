import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import TallyForm from './tallyForm';
import Links from '../../utils/links';
import { useAuthContext } from '../../providers/authProvider';

const Box = styled.div`
  margin: 24px 0;
`;

export default function ResourcesDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<any>();
  const {
    state: { userData, account },
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
  return <Box>{!!account && <TallyForm id={id} item={item} userData={userData} account={account} />}</Box>;
}
