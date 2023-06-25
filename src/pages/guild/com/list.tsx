import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
// import { Card, CardBody} from '@paljs/ui/Card';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import React from 'react';
import { ReTurnProject } from 'type/project.type';

const Box = styled.div`
  margin-top: 40px;
  overflow-x: hidden;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
  }
  .title {
    font-size: 14px;
    line-height: 1.5em;
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin: 15px;
  }
`;
const CardBox = styled.div`
  border: 1px solid #f1f1f1;
  margin-bottom: 40px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
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
interface Iprops {
  list: ReTurnProject[];
}

export default function ProjectAllList(props: Iprops) {
  const { list } = props;
  const router = useRouter();

  const toGo = (num: number) => {
    router.push(`/guild-info/${num}`);
  };
  return (
    <Box>
      <Row>
        {list?.map((item, index) => (
          <Col breakPoint={{ xs: 3, sm: 3, md: 3, lg: 2.4 }} key={index}>
            <CardBox>
              <Item onClick={() => toGo(item.id)}>
                <ImageBox>
                  <Photo>
                    <div className="aspect" />
                    <div className="content">
                      <div className="innerImg">
                        <img src={item.logo} alt="" />
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
    </Box>
  );
}
