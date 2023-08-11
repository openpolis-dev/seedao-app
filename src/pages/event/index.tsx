import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled, { css } from 'styled-components';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import { Button, ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';

const Box = styled.div`
  padding: 40px 0;
`;

const ActiveBox = styled.div`
  margin: 0 2rem;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 100%;
  }
  .title {
    font-size: 1rem;
    line-height: 1.5em;
    height: 1.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 1rem;
  }
`;

const CardBox = styled.div`
  border: 1px solid #f1f1f1;
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
`;
const ImageBox = styled.div`
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  width: 100%;

  img {
    width: 100%;
  }
`;
const Photo = styled.div`
  display: flex !important;
  overflow: hidden;
  .aspect {
    padding-bottom: 100%;
    height: 0;
    flex-grow: 1 !important;
  }
  .content {
    width: 100%;
    margin-left: -100% !important;
    max-width: 100% !important;
    flex-grow: 1 !important;
    position: relative;
  }
  .innerImg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    img {
      width: 100%;
    }
  }
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RhtBox = styled.div``;

const LineBox = styled.div`
  background: url('/images/homebg.png') center no-repeat;
  background-size: 100%;
  background-attachment: fixed;
  margin-bottom: 80px;
  .inner {
    background: rgba(161, 110, 255, 0.7);
    padding: 2.2rem;
  }
  ul {
    display: flex;
    align-items: center;
    width: 100%;
  }
  li {
    width: 33.33333%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .num {
    font-size: 3rem;
    font-weight: bold;
    margin-right: 1.5rem;
    font-family: 'Jost-Bold';
  }
`;

const CityBox = styled.div`
  margin: 0 40px;
`;

const RhtBoxT = styled.div``;
export default function Index() {
  const router = useRouter();

  const [list, setList] = useState([
    {
      name: 'Eth Dever side event - 在数字游民的会客厅',
      image: 'https://seedao-store.s3-us-east-2.amazonaws.com/seeu/srzzPofjFbCQ5LGzvWd9Uc.jpg',
      id: '1',
    },
    {
      name: 'Eth Dever side event - 在数字游民的会客厅',
      image: 'https://seedao-store.s3-us-east-2.amazonaws.com/seeu/52xuUfK866XtZoFMqGYYD1.jpg',
      id: '1',
    },
    {
      name: 'Eth Dever side event - 在数字游民的会客厅',
      image: 'https://seedao-store.s3-us-east-2.amazonaws.com/seeu/vGnVjkH6WrH1Tyg2dTs6a5.jpg',
      id: '1',
    },
    {
      name: 'Eth Dever side event - 在数字游民的会客厅',
      image: 'https://seedao-store.s3-us-east-2.amazonaws.com/seeu/ctArrpMXr6enT1PcF8UJty.png',
      id: '1',
    },
    {
      name: 'Eth Dever side event - 在数字游民的会客厅',
      image: 'https://seedao-store.s3-us-east-2.amazonaws.com/seeu/mf6AuWkzJr5fZPXxBbdfA7.jpg',
      id: '1',
    },
  ]);

  const toGo = () => {};
  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <ActiveBox>
            <TitBox>
              <span>Events</span>
              <RhtBoxT>
                <ButtonLink onClick={() => router.push('/create-event')} fullWidth shape="Rectangle">
                  Create
                </ButtonLink>
              </RhtBoxT>
            </TitBox>
            <Row>
              {list.map((item) => (
                <Col breakPoint={{ xs: 3, sm: 3, md: 3, lg: 2.4 }} onClick={() => router.push(`event/info/${item.id}`)}>
                  <CardBox>
                    <Item>
                      <ImageBox>
                        <Photo>
                          <div className="aspect" />
                          <div className="content">
                            <div className="innerImg">
                              <img src={item.image} alt="" />
                            </div>
                          </div>
                        </Photo>
                      </ImageBox>
                      <div className="title">{item.name}</div>
                    </Item>
                  </CardBox>
                </Col>
              ))}
            </Row>
          </ActiveBox>
        </Box>
      </Card>
    </Layout>
  );
}
