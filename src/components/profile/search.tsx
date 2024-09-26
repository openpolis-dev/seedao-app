import BackerNav from "../../components/common/backNav";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";

import { Input } from 'antd';
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";

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



export default function SearchProfile(){
  const { t } = useTranslation();



  return <Container>

    <BackerNav to="/sns/register" title="SNS Query" mb="0"  />
    <StepContainer>
      <div>
        <Box>
          <StepTitle>Search</StepTitle>
          <Content>
            <Input />
            <Button

              className="submitBtn"
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
