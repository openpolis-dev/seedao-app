import styled from 'styled-components';
import React, { useState } from 'react';
import { EvaIcon } from '@paljs/ui/Icon';
import { Button } from '@paljs/ui/Button';
import Add from './add';
import Del from './Del';

const Box = styled.div`
  padding: 20px;
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
      position: relative;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-right: 20px;
    }
    .topRht{
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      background: #f1f1f1;
      border: 1px solid #ccc;
      border-radius: 40px;
      cursor: pointer;
      //.inner{
      //  display:none;
      //  }
      }
      .active{
        border: 1px solid #a16eff;
        background: #fff;
        display:flex ;
        align-items: center;
        justify-content: center;
        .inner{

          width: 10px;
          height: 10px;
          background: #a16eff;
          border-radius: 20px;
        }
      }
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
  // const [current,setCurrent]= useState(0);
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selectArr, setSelectArr] = useState<number[]>([0, 3, 5]);

  const handleDel = () => {
    setEdit(true);
  };
  const closeDel = () => {
    // setEdit(false)
    setShowDel(true);
  };
  const closeAdd = () => {
    setShow(false);
  };
  const handleAdd = () => {
    setShow(true);
  };
  const closeRemove = () => {
    setShowDel(false);
  };

  const handleSelect = (num: number) => {
    const selectHas = selectArr.findIndex((item) => item === num);
    console.log(selectHas);
    let arr = [...selectArr];
    if (selectHas > 0) {
      arr.splice(selectHas, 1);
    } else {
      arr.push(num);
    }
    setSelectArr(arr);
  };
  const formatActive = (num: number) => {
    const arr = selectArr.filter((item) => item === num);
    return !!arr.length;
  };
  return (
    <Box>
      {show && <Add closeAdd={closeAdd} />}
      {showDel && <Del closeRemove={closeRemove} selectArr={selectArr} />}
      <TopBox>
        <Button onClick={() => handleAdd()}>添加成员</Button>
        {!edit && (
          <Button appearance="outline" onClick={() => handleDel()}>
            移除成员
          </Button>
        )}
        {edit && (
          <Button appearance="outline" onClick={() => closeDel()}>
            确定
          </Button>
        )}
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
                {edit && (
                  <div className={formatActive(index) ? 'topRht active' : 'topRht'}>
                    <div className="inner" />
                  </div>
                )}
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
                {edit && (
                  <div className={formatActive(index) ? 'topRht active' : 'topRht'} onClick={() => handleSelect(index)}>
                    <div className="inner" />
                  </div>
                )}
              </div>
              <LinkBox>
                <a href="#" target="_blank" rel="noreferrer">
                  <img src="/images/twitterNor.svg" alt="" />
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <img src="/images/discordNor.svg" alt="" />
                </a>
              </LinkBox>
            </li>
          ))}
        </UlBox>
      </ItemBox>
    </Box>
  );
}
