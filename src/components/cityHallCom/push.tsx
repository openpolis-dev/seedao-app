import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePickerStyle from 'components/datePicker';
import NoItem from 'components/noItem';
import publicJs from 'utils/publicJs';
import { PUSH_STATUS, IPushDisplay } from 'type/push.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { createPush, getPushList } from 'requests/push';
import { formatTime } from 'utils/time';
import InfiniteScroll from 'react-infinite-scroll-component';

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
    <CreateBox>
      <BlockTitle>{t('Push.CreatePush')}</BlockTitle>
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
    </CreateBox>
  );
};

const PushHistoryContent = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<IPushDisplay[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  const handlePage = (num: number) => {
    setPage(num + 1);
  };
  const handlePageSize = (num: number) => {
    setPageSize(num);
  };

  const handleCancel = () => {};
  const getList = async () => {
    try {
      const { data } = await getPushList({ page, size: pageSize, sort_field: 'created_at', sort_order: 'desc' });
      setList(
        data.rows.map((item) => ({
          ...item,
          timeDisplay: formatTime(new Date(item.created_at).getTime()),
        })),
      );
      setHasMore(data.rows.length >= pageSize);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <BlockTitle>{t('Push.History')}</BlockTitle>
      {list.length ? (
        <>
          <InfiniteScroll
            dataLength={list.length}
            next={getList}
            hasMore={hasMore}
            scrollableTarget="push-scroll"
            loader={<></>}
          >
            <TableBox id="push-scroll">
              {list.map((item, idx) => (
                <PushItem key={idx}>
                  <PushItemTop>
                    <PushItemTitle>{item.title}</PushItemTitle>
                    <PushItemContent>{item.content}</PushItemContent>
                    <JumpBox>
                      {t('Push.Href')}
                      {`: `}
                      <a href={item.jump_url} target="_blank" rel="noopener noreferrer">
                        {item.jump_url}
                      </a>
                    </JumpBox>
                  </PushItemTop>

                  <PushItemBottom>
                    <PushItemBottomLeft>
                      <div className="name">111</div>
                      <div className="date">{item.timeDisplay}</div>
                    </PushItemBottomLeft>
                    <StatusTag>{t('Push.Pushed')}</StatusTag>
                    {/* {item.status === PUSH_STATUS.WAITING && (
                        <Button size="sm" variant="outline-primary" onClick={() => handleCancel()}>
                          {t('general.cancel')}
                        </Button>
                      )} */}
                  </PushItemBottom>
                </PushItem>
              ))}
            </TableBox>
          </InfiniteScroll>
        </>
      ) : (
        <NoItem />
      )}
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
  justify-content: space-between;
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

const TableBox = styled.ul`
  width: 100%;
  /* height: calc(100vh - 250px);
  overflow: auto; */
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

const PushItem = styled.li`
  width: 480px;
  height: 178px;
  background: var(--bs-box--background);
  border-radius: 16px;
  border: 1px solid var(--bs-border-color);
  margin-bottom: 25px;
`;

const PushItemTop = styled.div`
  padding: 16px 24px;
`;

const PushItemBottom = styled.div`
  border-top: 1px solid var(--bs-border-color);
  display: flex;
  justify-content: space-between;
  padding: 9px 24px;
  align-items: center;
`;

const PushItemTitle = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  line-height: 22px;
`;

const PushItemContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--bs-body-color);
  margin-block: 8px;
`;

const JumpBox = styled.div`
  font-size: 14px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: var(--bs-body-color);
  a {
    color: #0085ff;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  padding-inline: 8px;
  line-height: 20px;

  background: #b0b0b0;
  border-radius: 6px;
  font-size: 12px;
  color: #000;
  text-align: center;
`;

const PushItemBottomLeft = styled.div`
  .name {
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;

const CreateBox = styled.div`
  width: 576px;
`;
