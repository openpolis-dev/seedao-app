import styled from 'styled-components';
import React from 'react';
import { EvaIcon } from '@paljs/ui/Icon';
import { Button } from '@paljs/ui/Button';

const Box = styled.div`
  padding: 20px;
  ul,
  li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const TitleBox = styled.div`
  font-weight: bold;
  margin-bottom: 30px;
`;

const UlBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    width: 23%;
    margin-right: 2%;
    border: 1px solid #f1f1f1;
    margin-bottom: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .fst {
      display: flex;
      align-items: center;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 20px;
    }
  }
`;

const LinkBox = styled.div`
  margin-top: 20px;
  img {
    width: 35px !important;
    height: 35px !important;
    margin-right: 20px;
  }
`;
const TopBox = styled.div`
  background: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  margin-bottom: 30px;
  button {
    margin-left: 20px;
  }
`;

export default function Members() {
  return (
    <Box>
      <TopBox>
        <Button>添加成员</Button>
        <Button appearance="outline">移除成员</Button>
      </TopBox>
      <ItemBox>
        <TitleBox>负责人</TitleBox>
        <UlBox>
          {[...Array(3)].map((item, index) => (
            <li key={index}>
              <div className="fst">
                <img src="" alt="" />
                <div>
                  <div>昵称</div>
                  <div>
                    <span>0x23...Fdf0</span>
                    <EvaIcon name="clipboard-outline" />
                  </div>
                </div>
              </div>
              <LinkBox>
                <img src="/images/twitterNor.svg" alt="" />
                <img src="/images/discordNor.svg" alt="" />
              </LinkBox>
            </li>
          ))}
        </UlBox>
      </ItemBox>
      <ItemBox>
        <TitleBox>其他成员</TitleBox>
        <UlBox>
          {[...Array(10)].map((item, index) => (
            <li key={index}>
              <div className="fst">
                <img src="" alt="" />
                <div>
                  <div>昵称</div>
                  <div>
                    <span>0x23...Fdf0</span>
                    <EvaIcon name="clipboard-outline" />
                  </div>
                </div>
              </div>
              <LinkBox>
                <img src="/images/twitterNor.svg" alt="" />
                <img src="/images/discordNor.svg" alt="" />
              </LinkBox>
            </li>
          ))}
        </UlBox>
      </ItemBox>
    </Box>
  );
}
