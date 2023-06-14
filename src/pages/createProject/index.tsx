import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import { InputGroup } from '@paljs/ui/Input';
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';

const Box = styled.div`
  .btnBtm {
    margin-right: 20px;
  }
`;

const CardBox = styled(Card)`
  min-height: 80vh;
`;

const BtmBox = styled.div`
  margin-top: 50px;
`;

const UlBox = styled.ul`
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 90px;
    }
  }
`;

const InputBox = styled(InputGroup)`
  width: 600px;
  margin-right: 20px;
`;

const ItemBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .titleLft {
    margin-right: 10px;
  }
`;

interface obj {
  address: string;
}

export default function CreateProject() {
  const [adminList, setAdminList] = useState<obj[]>([
    {
      address: '0x183F09C3cE99C02118c570e03808476b22d63191',
    },
  ]);
  const [memberList, setMemberList] = useState<obj[]>([
    {
      address: '0x183F09C3cE99C02118c570e03808476b22d63191',
    },
  ]);
  const [proList, setProList] = useState([
    {
      link: 'http://--',
    },
  ]);
  const [token, setToken] = useState<string | number>('');

  const [credit, setCredit] = useState<string | number>('');

  const [proName, setProName] = useState('');

  const handleInput = (e: ChangeEvent, index: number, type: string) => {
    const { value } = e.target as HTMLInputElement;
    let arr: any[] = [];
    switch (type) {
      case 'member':
        arr = [...memberList];
        arr[index].address = value;
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr[index].address = value;
        setAdminList(arr);
        break;
      case 'proposal':
        arr = [...proList];
        arr[index].link = value;
        setProList(arr);
        break;
      case 'proName':
        setProName(value);
        break;
      case 'credit':
        setCredit(value);
        break;
      case 'token':
        setToken(value);
        break;
    }
  };

  const handleAdd = (type: string) => {
    let arr: any[] = [];
    switch (type) {
      case 'member':
        arr = [...memberList];
        arr.push({
          address: '',
        });
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr.push({
          address: '',
        });
        setAdminList(arr);
        break;
      case 'proposal':
        arr = [...proList];
        arr.push({
          link: '',
        });
        setProList(arr);
        break;
    }
  };
  const removeItem = (index: number, type: string) => {
    let arr: any[] = [];
    switch (type) {
      case 'member':
        arr = [...memberList];
        arr.splice(index, 1);
        setMemberList(arr);
        break;
      case 'admin':
        arr = [...adminList];
        arr.splice(index, 1);
        setAdminList(arr);
        break;
      case 'proposal':
        arr = [...proList];
        arr.splice(index, 1);
        setProList(arr);
        break;
    }
  };

  return (
    <Layout title="">
      <Box>
        <CardBox>
          <CardHeader>Create Project</CardHeader>
          <CardBody>
            <UlBox>
              <li>
                <div className="title">项目名称</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={proName}
                    onChange={(e) => handleInput(e, 0, 'proName')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">负责人</div>
                <div>
                  {adminList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder="Size small"
                          value={item.address}
                          onChange={(e) => handleInput(e, index, 'admin')}
                        />
                      </InputBox>
                      <span onClick={() => handleAdd('admin')}>
                        <EvaIcon name="plus-outline" status="Primary" />
                      </span>
                      {!(!index && index === memberList.length - 1) && (
                        <span onClick={() => removeItem(index, 'admin')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
              <li>
                <div className="title">关联提案</div>
                <div>
                  {proList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder="Size small"
                          value={item.link}
                          onChange={(e) => handleInput(e, index, 'proposal')}
                        />
                      </InputBox>
                      <span onClick={() => handleAdd('proposal')}>
                        <EvaIcon name="plus-outline" status="Primary" />
                      </span>
                      {!(!index && index === memberList.length - 1) && (
                        <span onClick={() => removeItem(index, 'proposal')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
              <li>
                <div className="title">预算</div>
                <div>
                  <ItemBox>
                    <span className="titleLft">积分</span>
                    <InputGroup fullWidth>
                      <input
                        type="text"
                        placeholder="Size small"
                        value={credit}
                        onChange={(e) => handleInput(e, 0, 'credit')}
                      />
                    </InputGroup>
                  </ItemBox>
                  <ItemBox>
                    <span className="titleLft">USD</span>
                    <InputGroup fullWidth>
                      <input
                        type="text"
                        placeholder="Size small"
                        value={token}
                        onChange={(e) => handleInput(e, 0, 'token')}
                      />
                    </InputGroup>
                  </ItemBox>
                </div>
              </li>
              <li>
                <div className="title">成员</div>
                <div>
                  {memberList.map((item, index) => (
                    <ItemBox key={`mem_${index}`}>
                      <InputBox fullWidth>
                        <input
                          type="text"
                          placeholder="Size small"
                          value={item.address}
                          onChange={(e) => handleInput(e, index, 'member')}
                        />
                      </InputBox>
                      <span onClick={() => handleAdd('member')}>
                        <EvaIcon name="plus-outline" status="Primary" />
                      </span>
                      {!(!index && index === memberList.length - 1) && (
                        <span onClick={() => removeItem(index, 'member')}>
                          <EvaIcon name="minus-outline" status="Primary" />
                        </span>
                      )}
                    </ItemBox>
                  ))}
                </div>
              </li>
            </UlBox>
            <BtmBox>
              <Button appearance="outline" className="btnBtm">
                取消
              </Button>
              <Button>确定</Button>
            </BtmBox>
          </CardBody>
        </CardBox>
      </Box>
    </Layout>
  );
}
