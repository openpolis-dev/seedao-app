import BackerNav from "../../components/common/backNav";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import sns from '@seedao/sns-js';
import { Input } from 'antd';
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import ProfileComponent from "../../profile-components/profile";
import React, { useState } from "react";
import { useAuthContext } from "../../providers/authProvider";

const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;
const StepContainer = styled.div`
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    width: 100%;

`;

const Box = styled.div`
    background-color: var(--bs-box-background);
    width: 600px;
    box-shadow: 2px 4px 4px 0px var(--box-shadow);
    border-radius: 16px;
    text-align: center;
    position: relative;
`;

const StepTitle = styled.div`
  font-family: 'Poppins-Medium';
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  color: var(--bs-body-color_active);
    padding: 40px 0;
`;

const Content = styled.div`
  display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    input{
        height:45px;
    }
    .submitBtn{
        width: 50%;
        margin: 30px 0;
    }
`
const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 43px;
  color: var(--sns-font-color);
`;
const FlexBox = styled.div`
  display: flex;
    align-items: center;
    gap: 10px;
    width: 90%;
    input{
        flex-grow: 1;
    }
`

export default function SearchProfile(){
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [snsName,setSnsName] = useState("");
  const [address,setAddress] = useState("");

  const {
    state: { theme },
  } = useAuthContext();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async () =>{
    const address = await sns.resolve(`${snsName}.seedao`)
    setAddress(address)


    setShowModal(true);
  }

  return <Container>
    {showModal && <ProfileComponent theme={theme} address={address} handleClose={handleClose} />}
    <BackerNav to="/sns/register" title="SNS Query" mb="0"  />
    <StepContainer>
      <div>
        <Box>
          <StepTitle>{t('SNS.searchTitle')}</StepTitle>
          <StepDesc>{t('SNS.Step1Desc')}</StepDesc>
          <Content>
            <FlexBox>
              <Input value={snsName} onChange={(e) => setSnsName(e.target.value)} />
              <span>.seedao</span>
            </FlexBox>

            <Button
              onClick={() => handleSubmit()}
              className="submitBtn"
              disabled={!snsName.length}
            >
              Submit
              {/*{loading ? <Loading /> : <span>Parse</span>}*/}
            </Button>
          </Content>
        </Box>


      </div>


    </StepContainer>


  </Container>
}
