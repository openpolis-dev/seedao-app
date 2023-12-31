import styled from 'styled-components';
// import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import React, { ChangeEvent, useState } from 'react';
// import { InputGroup } from '@paljs/ui/Input';
// import { EvaIcon } from '@paljs/ui/Icon';
import { useTranslation } from 'react-i18next';
import requests from 'requests';
import { useParams } from 'react-router-dom';
import Loading from 'components/loading';
import useToast, { ToastType } from 'hooks/useToast';
import { DashLg, PlusLg } from 'react-bootstrap-icons';

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
  min-width: 500px;
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
  .iconForm {
    color: var(--bs-primary);
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
`;
const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(237, 241, 247);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: rgb(34, 43, 69);
  font-family: Inter-Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

const CardBody = styled.div`
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
`;
interface Iprops {
  closeModal: (ifRefresh: boolean) => void;
  id: string | undefined | number;
}
export default function PropsalModal(props: Iprops) {
  const { closeModal, id } = props;
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  // const router = useRouter();
  // const { id } = useParams();
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
    for (const l of list) {
      if (l) {
        if (l.startsWith('https://forum.seedao.xyz/thread/')) {
          const items = l.split('/').reverse();
          for (const it of items) {
            if (it) {
              const _id = it.split('-').reverse()[0];
              ids.push(_id);
              break;
            }
          }
        } else if (l.indexOf('/proposal/thread/') > -1) {
          const items = l.split('/').reverse();
          for (const it of items) {
            if (it) {
              ids.push(it);
              break;
            }
          }
        } else {
          showToast(t('Msg.ProposalLinkMsg'), ToastType.Danger);
          return;
        }
      }
    }
    try {
      setLoading(true);
      await requests.project.addRelatedProposal(id as string, ids);
    } catch (error) {
      logError('handle related proposals failed: ', error);
      showToast(`${t('Msg.RequestFailed')}: ${error}`, ToastType.Danger);
    } finally {
      setLoading(false);
      closeModal(true);
    }
  };

  return (
    <Mask>
      {loading && <Loading />}
      {Toast}
      <Card>
        <CardHeader>{t('Project.AssociatedProposal')}</CardHeader>
        <CardBody>
          <Box>
            <ul>
              {list.map((item, index) => (
                <li key={index}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="https://forum.seedao.xyz/thread/..."
                      value={item}
                      onChange={(e) => handleInput(e, index)}
                    />
                  </InputGroup>
                  {index === list.length - 1 && (
                    <span className="iconForm" onClick={() => handleAdd()}>
                      <PlusLg />
                    </span>
                  )}

                  {!(!index && index === list.length - 1) && (
                    <span className="iconForm" onClick={() => removeList(index)}>
                      <DashLg />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Box>
        </CardBody>
        <CardFooter>
          <Button variant="outline-primary" className="btnBtm" onClick={() => closeModal(false)}>
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
