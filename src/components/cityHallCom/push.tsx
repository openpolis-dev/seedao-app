import styled from 'styled-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePickerStyle from 'components/datePicker';
import Page from 'components/pagination';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { PUSH_STATUS, IPushDisplay } from 'type/push.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';

enum PUSH_TAB {
  CREATE = 1,
  HISTORY,
}

const formatPushStatus = (status: PUSH_STATUS, t: Function) => {
  switch (status) {
    case PUSH_STATUS.WAITING:
      return t('Push.Waiting');
    case PUSH_STATUS.SENDED:
      return t('Push.Sended');
    case PUSH_STATUS.CANCELED:
      return t('Push.Canceled');
    default:
      return '';
  }
};

const CreatePushContent = () => {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [href, setHref] = useState('');

  const handleCreate = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
    } catch (error: any) {
      console.error(error);
      showToast(error, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  return (
    <Form>
      <FormGroup className="mb-3">
        <FormLabel>{t('Push.Title')}</FormLabel>
        <FormInput type="text" value={title} onChange={(e: any) => setTitle(e.target.value)} />
      </FormGroup>
      <FormGroup className="mb-3">
        <FormLabel>{t('Push.Content')}</FormLabel>
        <FormInput
          className="form-control"
          as="textarea"
          rows={5}
          value={content}
          onChange={(e: any) => setContent(e.target.value)}
        />
      </FormGroup>
      <FormGroup className="mb-3">
        <FormLabel>{t('Push.Href')}</FormLabel>
        <FormInput type="text" value={href} onChange={(e: any) => setHref(e.target.value)} />
      </FormGroup>
      <FormGroup className="mb-3">
        <Form.Check type="checkbox" className="checkbox" />
        <FormLabel>{t('Push.Timer')}</FormLabel>
        <DatePickerStyle placeholder="" onChange={() => {}} dateTime={new Date()} />
      </FormGroup>
      <SubmitBox className="mt-3">
        <Button variant="primary" type="submit" onClick={handleCreate}>
          {t('Push.Create')}
        </Button>
      </SubmitBox>
    </Form>
  );
};

const PushHistoryContent = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<IPushDisplay[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(100);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const handleCancel = () => {};

  return (
    <TableBox>
      {list.length ? (
        <>
          <table className="table" cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th>{t('Push.Title')}</th>
                <th>{t('Push.Content')}</th>
                <th>{t('Push.Href')}</th>
                <th>{t('Push.Time')}</th>
                <th>{t('Push.Status')}</th>
                <th>{t('Push.Creator')}</th>
                <th>{t('Push.Options')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.title}>
                  <td>{item.timeDisplay}</td>
                  <td>{item.content}</td>
                  <td>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.href}
                    </a>
                  </td>
                  <td>{item.timeDisplay}</td>
                  <td>{formatPushStatus(item.status, t)}</td>

                  <td>
                    <div>
                      <span>{publicJs.AddressToShow(item.creator)}</span>
                    </div>
                  </td>
                  <td>
                    {item.status === PUSH_STATUS.WAITING && (
                      <Button size="sm" variant="outline-primary" onClick={() => handleCancel()}>
                        {t('general.cancel')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Page
            itemsPerPage={pageSize}
            total={total}
            current={page - 1}
            handleToPage={handlePage}
            handlePageSize={handlePageSize}
          />
        </>
      ) : (
        <NoItem />
      )}
    </TableBox>
  );
};

export default function PushPanel({ id }: { id?: number }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PUSH_TAB>(PUSH_TAB.CREATE);

  const getContent = () => {
    switch (activeTab) {
      case PUSH_TAB.CREATE:
        return <CreatePushContent />;
      case PUSH_TAB.HISTORY:
        return <PushHistoryContent />;
      default:
        return <></>;
    }
  };

  return (
    <Box>
      <TopBox>
        <Button
          onClick={() => setActiveTab(PUSH_TAB.CREATE)}
          variant={activeTab === PUSH_TAB.CREATE ? 'primary' : 'outline-primary'}
        >
          {t('Push.CreatePush')}
        </Button>
        <Button
          onClick={() => setActiveTab(PUSH_TAB.HISTORY)}
          variant={activeTab === PUSH_TAB.HISTORY ? 'primary' : 'outline-primary'}
        >
          {t('Push.History')}
        </Button>
      </TopBox>
      {getContent()}
    </Box>
  );
}

const Box = styled.div`
  padding: 20px 0;
`;

const TopBox = styled.div`
  background: #f8f8f8;
  display: flex;
  justify-content: flex-start;
  padding: 20px;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;

const FormGroup = styled(Form.Group)`
  display: flex;
  gap: 20px;
  align-items: center;
  .checkbox {
    width: unset;
  }
  .form-label {
    width: unset;
  }
`;

const FormLabel = styled(Form.Label)`
  margin-bottom: unset;
  width: 80px;
`;

const FormInput = styled(Form.Control)`
  width: 50%;
  min-width: 200px;
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  table {
    th {
      background: transparent;
      color: #6e6893;
      border: 1px solid #d9d5ec;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
    td {
      border-bottom-color: #d9d5ec;
    }
    tr:hover td {
      background: #f2f0f9;
    }
  }
`;

const SubmitBox = styled.div`
  text-align: right;
`;
