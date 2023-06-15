import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup } from '@paljs/ui/Input';
import { Button } from '@paljs/ui/Button';

const Box = styled.div`
  padding: 40px 20px;
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100px;
    height: 100px;
    border-radius: 100px;
  }
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
const MidBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  flex-direction: column;
`;

export default function Profile() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wechat, setWechat] = useState('');
  const [mirror, setMirror] = useState('');
  const [google, setGoogle] = useState('');
  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'userName':
        setUserName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'discord':
        setDiscord(value);
        break;
      case 'twitter':
        setTwitter(value);
        break;
      case 'wechat':
        setWechat(value);
        break;
      case 'mirror':
        setMirror(value);
        break;
      case 'google':
        setGoogle(value);
        break;
    }
  };
  return (
    <Layout title="Profile">
      <CardBox>
        <Box>
          <AvatarBox>
            <img src="" alt="" />
          </AvatarBox>
          <MidBox>
            <UlBox>
              <li>
                <div className="title">名称</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={userName}
                    onChange={(e) => handleInput(e, 'userName')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">邮箱地址</div>
                <InputBox fullWidth>
                  <input type="text" placeholder="Size small" value={email} onChange={(e) => handleInput(e, 'email')} />
                </InputBox>
              </li>
              <li>
                <div className="title">Discord</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={discord}
                    onChange={(e) => handleInput(e, 'discord')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Twitter</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={twitter}
                    onChange={(e) => handleInput(e, 'twitter')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">微信号</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={wechat}
                    onChange={(e) => handleInput(e, 'wechat')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Mirror</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={mirror}
                    onChange={(e) => handleInput(e, 'mirror')}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">Google</div>
                <InputBox fullWidth>
                  <input
                    type="text"
                    placeholder="Size small"
                    value={google}
                    onChange={(e) => handleInput(e, 'google')}
                  />
                </InputBox>
              </li>
            </UlBox>
            <div>
              <Button>确定</Button>
            </div>
          </MidBox>
        </Box>
      </CardBox>
    </Layout>
  );
}
