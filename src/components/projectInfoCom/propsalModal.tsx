import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { EvaIcon } from '@paljs/ui/Icon';
import useTranslation from 'hooks/useTranslation';
import requests from 'requests';
import { useRouter } from 'next/router';
import Loading from 'components/loading';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btnBtm {
    margin-right: 20px;
  }
`;
const Box = styled.div`
  ul {
    margin-top: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    input {
      margin-right: 10px;
      min-width: 450px;
    }
    span {
      margin-left: 10px;
    }
  }
`;

interface Iprops {
  closeModal: (ifRefresh: boolean) => void;
}
export default function PropsalModal(props: Iprops) {
  const { closeModal } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [list, setList] = useState(['']);
  const [loading, setLoading] = useState(false);
  const handleInput = (e: ChangeEvent, index: number) => {
    const { value } = e.target as HTMLInputElement;
    let arr: string[] = [];
    arr = [...list];
    arr[index] = value;
    setList(arr);
  };

  const handleAdd = () => {
    const arr = [...list];
    arr.push('');
    setList(arr);
  };

  const removeList = (index: number) => {
    const arr = [...list];
    arr.splice(index, 1);
    setList(arr);
  };

  const handleProposal = async () => {
    const ids: string[] = [];
    list.forEach((l) => {
      if (l && l.startsWith('https://forum.seedao.xyz/thread/')) {
        const _last = l.split('/').reverse()[0];
        const _id = _last.split('-').reverse()[0];
        ids.push(_id);
      }
    });
    const reqs = ids.map((pid) => requests.project.addRelatedProposal(id as string, pid));
    try {
      setLoading(true);
      await Promise.allSettled(reqs);
    } catch (error) {
      console.error('handle related proposals failed: ', error);
    } finally {
      setLoading(false);
      closeModal(true);
    }
  };

  return (
    <Mask>
      {loading && <Loading />}
      <Card>
        <CardHeader>{t('Project.AssociatedProposal')}</CardHeader>
        <CardBody>
          <Box>
            <ul>
              {list.map((item, index) => (
                <li key={index}>
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      placeholder={t('Project.AssociatedProposal')}
                      value={item}
                      onChange={(e) => handleInput(e, index)}
                    />
                  </InputGroup>
                  {index === list.length - 1 && (
                    <span onClick={() => handleAdd()}>
                      <EvaIcon name="plus-outline" status="Primary" />
                    </span>
                  )}

                  {!(!index && index === list.length - 1) && (
                    <span onClick={() => removeList(index)}>
                      <EvaIcon name="minus-outline" status="Primary" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Box>
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btnBtm" onClick={() => closeModal(false)}>
            {t('general.cancel')}
          </Button>
          <Button disabled={!list.length} onClick={handleProposal}>
            {t('general.confirm')}
          </Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
