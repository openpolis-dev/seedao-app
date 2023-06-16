import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import ProjectAllList from 'pages/project/com/list';
import styled from 'styled-components';
import { ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';
import { Card, CardHeader } from '@paljs/ui/Card';
import useTranslation from 'hooks/useTranslation';
import { getMyProjects, getProjects } from 'requests/project';
import { useAuthContext } from 'providers/authProvider';
import Page from 'components/pagination';
import { ReTurnProject } from 'type/project.type';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
  a:hover {
    color: #fff;
    opacity: 0.8;
  }
`;

const TopLine = styled.div`
  position: absolute;
  right: 20px;
  top: 14px;
  z-index: 9;
  cursor: pointer;
`;

const CardBox = styled(Card)``;

export interface listObj {
  name: string;
  id: number;
}

export default function Index() {
  const { t } = useTranslation();
  const {
    state: { language },
  } = useAuthContext();
  const router = useRouter();

  const [pageCur, setPageCur] = useState(1);
  const [size, setSize] = useState(1);
  const [total, setTotal] = useState(1);

  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<listObj[]>([]);
  const [proList, setProList] = useState<ReTurnProject[]>([]);

  useEffect(() => {
    getList();
  }, [pageCur, current]);

  useEffect(() => {
    setList([
      {
        name: t('Project.AllProjects'),
        id: 0,
      },
      {
        name: t('Project.Closed'),
        id: 1,
      },
      {
        name: t('Project.Joined'),
        id: 2,
      },
    ]);
  }, [language]);

  const getList = async () => {
    const stt = current === 1 ? 'closed' : '';
    const obj: IPageParams = {
      status: stt,
      page: pageCur,
      size,
      sort_order: 'desc',
      sort_field: 'created_at',
    };
    console.log('===current=', current, obj);
    if (current < 2) {
      const rt = await getProjects(obj);
      console.log('====rt.data=', rt.data);
      const { rows, page, size, total } = rt.data;
      console.log('=======obj', size, total, page);
      setProList(rows);
      setSize(size);
      setTotal(total);
      setPageCur(page);
    } else {
      console.error('===current=', current, obj);
      const rt = await getMyProjects(obj);
      const { rows, page, size, total } = rt.data;
      console.error('=====222==obj', size, obj);
      setProList(rows);
      setSize(size);
      setTotal(total);
      setPageCur(page);
    }
  };
  const selectCurrent = (e: number) => {
    setCurrent(e);
  };
  const handlePage = (num: number) => {
    setPageCur(num + 1);
  };
  const handlePageSize = (num: number) => {
    // setSize(num);
  };

  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <TopLine>
            <ButtonLink onClick={() => router.push('/createProject')} fullWidth shape="Rectangle">
              {t('Project.create')}
            </ButtonLink>
          </TopLine>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <CardHeader>
                <Tabs activeIndex={0} onSelect={(e) => selectCurrent(e)}>
                  {list.map((item) => (
                    <Tab key={item.id} title={item.name} responsive>
                      <ProjectAllList list={proList} />
                      {size}
                      {total > size && (
                        <div>
                          <Page
                            itemsPerPage={size}
                            total={total}
                            current={pageCur - 1}
                            handleToPage={handlePage}
                            handlePageSize={handlePageSize}
                          />
                        </div>
                      )}
                    </Tab>
                  ))}
                </Tabs>
              </CardHeader>
            </Col>
          </Row>
        </Box>
      </Card>
    </Layout>
  );
}
