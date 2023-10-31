import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
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
import { createPush, getPushList } from 'requests/push';
import { formatTime } from 'utils/time';

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

  const handleCreate = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await createPush({
        title,
        content,
        jump_url: href,
      });
      setTitle('');
      setContent('');
      setHref('');
    } catch (error: any) {
      console.error(error);
      showToast(error, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  const createBtnDisabled = useMemo(() => {
    return !title || !href || !title.trim() || !href.trim();
  }, [title, href]);
  return (
    <div style={{ flex: 1 }}>
      <BlockTitle>创建推送</BlockTitle>
      <Form>
        <FormGroup>
          <FormLabel>
            {t('Push.Title')} <span className="required">*</span>
          </FormLabel>
          <FormInput type="text" value={title} onChange={(e: any) => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <FormLabel>{t('Push.Content')}</FormLabel>
          <FormInput
            className="form-control"
            as="textarea"
            rows={5}
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>
            {t('Push.Href')} <span className="required">*</span>
          </FormLabel>
          <FormInput type="text" value={href} onChange={(e: any) => setHref(e.target.value)} />
        </FormGroup>
        {/* <FormGroup>
          <div className="timer-group">
            <Form.Check type="checkbox" className="checkbox" />
            <div style={{ whiteSpace: 'nowrap' }}>{t('Push.Timer')}</div>
            <DatePickerStyle placeholder="" onChange={() => {}} dateTime={new Date()} />
          </div>
        </FormGroup> */}
      </Form>
      <SubmitBox>
        <Button variant="primary" type="submit" onClick={handleCreate} disabled={createBtnDisabled}>
          {t('Push.Create')}
        </Button>
      </SubmitBox>
    </div>
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

  useEffect(() => {
    const getList = async () => {
      try {
        const { data } = await getPushList({ page, size: pageSize, sort_field: '', sort_order: 'desc' });
        setTotal(data.total);
        setList(
          data.rows.map((item) => ({
            ...item,
            timeDisplay: formatTime(new Date(item.created_at).getTime()),
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };
    getList();
  }, [page, pageSize]);

  return (
    <div>
      <BlockTitle>推送记录</BlockTitle>
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
                  {/* <th>{t('Push.Status')}</th> */}
                  <th>{t('Push.Creator')}</th>
                  {/* <th>{t('Push.Options')}</th> */}
                </tr>
              </thead>
              <tbody>
                {list.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.content}</td>
                    <td>
                      <a href={item.jump_url} target="_blank" rel="noreferrer">
                        {item.jump_url?.slice(0, 10) + '...'}
                      </a>
                    </td>
                    <td>{item.timeDisplay}</td>
                    {/* <td>{formatPushStatus(item.status, t)}</td> */}
                    <td>
                      <div>
                        <span>{publicJs.AddressToShow(item.creator_wallet)}</span>
                      </div>
                    </td>
                    {/* <td>
                    {item.status === PUSH_STATUS.WAITING && (
                      <Button size="sm" variant="outline-primary" onClick={() => handleCancel()}>
                        {t('general.cancel')}
                      </Button>
                    )}
                  </td> */}
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
              dir="right"
            />
          </>
        ) : (
          <NoItem />
        )}
      </TableBox>
    </div>
  );
};

export default function PushPanel({ id }: { id?: number }) {
  return (
    <Box>
      <CreatePushContent />
      <PushHistoryContent />
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled(Form.Group)`
  .checkbox {
    width: unset;
  }
  margin-bottom: 40px;
  .timer-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormLabel = styled(Form.Label)`
  margin-bottom: 24px;
  font-family: unset;
  .required {
    color: darkred;
  }
`;

const FormInput = styled(Form.Control)`
  min-width: 200px;
`;

const TableBox = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 2;
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
  margin-top: 52px;
  button {
    min-width: 120px;
  }
`;

const BlockTitle = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 39px;
`;
