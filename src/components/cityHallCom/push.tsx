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
import PushDetailModal, {
  PushItemTop,
  PushItemBottom,
  PushItemTitle,
  PushItemContent,
  JumpBox,
  StatusTag,
  PushItemBottomLeft,
} from 'components/modals/pushDetailModal';
import sns from '@seedao/sns-js';

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
      showToast(t('Push.Success'), ToastType.Success);
    } catch (error: any) {
      console.error(error);
      showToast(error, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  const createBtnDisabled = useMemo(() => {
    return !title || !href || !title.trim() || !href.trim() || !href.trim().startsWith('https://');
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
          <FormInput
            type="text"
            value={href}
            onChange={(e: any) => setHref(e.target.value)}
            placeholder="https://..."
          />
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
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [showRecord, setShowRecord] = useState<IPushDisplay>();
  const [wallet2snsMap] = useState<{ [k: string]: string }>({});

  const handleCancel = () => {
    // TODO
  };
  const getList = async () => {
    try {
      const { data } = await getPushList({ page, size: pageSize, sort_field: 'created_at', sort_order: 'desc' });
      const _list = [
        ...list,
        ...data.rows.map((item) => ({
          ...item,
          timeDisplay: formatTime(new Date(item.created_at).getTime()),
        })),
      ];
      setList(_list);
      setHasMore(_list.length < data.total);
      setPage(page + 1);
      const _wallets: string[] = [];
      _list.forEach((item) => {
        const _wallet = item.creator_wallet.toLocaleLowerCase();
        if (!wallet2snsMap[_wallet]) {
          _wallets.push(_wallet);
        }
      });
      if (_wallets.length) {
        try {
          const res = await sns.names(_wallets);
          const _map = { ...wallet2snsMap };
          res.forEach((r, idx) => {
            _map[_wallets[idx]] = r || publicJs.AddressToShow(_wallets[idx]);
          });
        } catch (error) {
          console.error('parse sns failed', error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      {showRecord && (
        <PushDetailModal
          data={showRecord}
          handleClose={() => setShowRecord(undefined)}
          sns={
            wallet2snsMap[showRecord.creator_wallet.toLocaleLowerCase()] ||
            publicJs.AddressToShow(showRecord.creator_wallet)
          }
        />
      )}
      <RhtBox>
        <BlockTitle>{t('Push.History')}</BlockTitle>
        {list.length ? (
          <PushContentBox id="push-scroll">
            <InfiniteScroll
              dataLength={list.length}
              next={getList}
              hasMore={hasMore}
              scrollableTarget="push-scroll"
              loader={<LoadingBottom>{t('general.Loading')}</LoadingBottom>}
            >
              {list.map((item, idx) => (
                <PushItem key={idx} onClick={() => setShowRecord(item)}>
                  <PushItemTop>
                    <PushItemTitle className="clip">{item.title}</PushItemTitle>
                    <PushItemContent className="clip">{item.content}</PushItemContent>
                    <JumpBox className="clip">
                      {t('Push.Href')}
                      {`: `}
                      <a href={item.jump_url} target="_blank" rel="noopener noreferrer">
                        {item.jump_url}
                      </a>
                    </JumpBox>
                  </PushItemTop>

                  <PushItemBottom>
                    <PushItemBottomLeft>
                      <div className="name">
                        {wallet2snsMap[item.creator_wallet.toLocaleLowerCase()] ||
                          publicJs.AddressToShow(item.creator_wallet)}
                      </div>
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
            </InfiniteScroll>
          </PushContentBox>
        ) : (
          <NoItem />
        )}
      </RhtBox>
    </div>
  );
};

export default function PushPanel() {
  return (
    <Box>
      <CreatePushContent />
      <PushHistoryContent />
    </Box>
  );
}

const RhtBox = styled.div`
  padding: 24px;
  background: var(--bs-box--background);
  border-radius: 24px;
  box-shadow: var(--box-shadow);
`;

const PushContentBox = styled.div`
  height: calc(100vh - 280px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const Box = styled.div`
  display: flex;
  gap: 60px;
  height: 100%;
  @media (max-width: 1240px) {
    justify-content: space-between;
    gap: 100px;
  }
  @media (max-width: 1000px) {
    gap: 40px;
  }

  @media (max-width: 860px) {
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

const SubmitBox = styled.div`
  margin-top: 52px;
  button {
    min-width: 120px;
  }
`;

const BlockTitle = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 5px;
`;

const PushItem = styled.div`
  cursor: pointer;
  width: 480px;
  border-bottom: 8px solid var(--push-border);
  margin-bottom: 5px;
`;

const CreateBox = styled.div`
  width: 576px;
  @media (max-width: 860px) {
    width: 480px;
  }
`;

const LoadingBottom = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 22px;
  color: var(--bs-body-color);
`;
