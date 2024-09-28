import BackerNav from "../../components/common/backNav";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import sns from "@seedao/sns-js";
import { Input } from 'antd';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from 'react-bootstrap';
import { ethers } from "ethers";
import useToast, { ToastType } from "../../hooks/useToast";

const { TextArea } = Input;


const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
`;
const StepContainer = styled.div`
    margin-top: 20px;
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

const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 30px;
  color: var(--sns-font-color);
`;

const TxBox = styled(TextArea)`
  width: 90%;
  height: 200px!important;
  box-sizing: border-box;
  border: 1px solid var(--table-border);
  margin: 0 auto;
    background: var(--bs-body-bg);
  border-radius: 8px;
  padding-left: 13px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  color: var(--bs-body-color_active);
    resize: none!important;
`;

const TableBox = styled.div`
    width: 100%;
 
    margin-top: 20px;
    background-color: var(--bs-box-background);
    box-shadow: 2px 4px 4px 0px var(--box-shadow);
    border-radius: 16px;
    text-align: center;
    position: relative;
    font-size: 14px;
    
    
    table{
        width: 100%;
        color: var(--bs-body-color_active);
    }
    th {
        text-align: center;
        padding: 20px 20px;
    }
    td {
        vertical-align: middle;
        border-top: 1px solid var(--bs-border-color);
        border-bottom: 0;
        padding: 15px 20px;
        font-size: 12px;
    }
    tbody tr {
        border: 0;
    }
    tr:hover {
        td {
            //border-top: 0;
            background: var(--bs-menu-hover);
        }
    }
`;

const FlexLine = styled.div`
  display: flex;
    margin: 0 30px;
    gap: 10px;
    .submitBtn{
        width: 50%;
        margin: 30px 0;
    }
`

export default function SnsQuery(){
  const { t } = useTranslation();
  const [areaValue, setAreaValue] = useState("");

  const [resultList, setResultList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type,setType] = useState("sns");
  const { showToast } = useToast();

  const AddressZero = "0x0000000000000000000000000000000000000000";

  const onParse = () => {
    setType("sns")
    setResultList([])
    const to_be_parsed:any[] = [];
    areaValue.split("\n").forEach((item) => {
      const str = item.trim();
      if (str && str.endsWith(".seedao")) {
        to_be_parsed.push(str);
      }
    });
    if (!to_be_parsed.length) {
      // console.log("No SNS found in the input area");
      showToast("No SNS found in the input area", ToastType.Danger);
      return;
    }
    setLoading(true);
    const r_list:any[] = [];
    const unique_list = Array.from(new Set(to_be_parsed));
    sns
      .resolves(unique_list)
      .then((result) => {
        result.forEach((r, i) => {
          r_list.push([unique_list[i], r === AddressZero ? "" : r]);
        });
        setResultList(r_list);

      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });

  };


  const onAddress = () => {
    setType("address")
    setResultList([])
    const to_be_address:any[] = [];
    areaValue.split("\n").forEach((item) => {
      const str = item.trim();
      if (str && ethers.utils.isAddress(str)) {
        to_be_address.push(str);
      }
    });
    if (!to_be_address.length) {
      console.log("No Address found in the input area");
      showToast("No Address found in the input area", ToastType.Danger);
      return;
    }
    setLoading(true);
    const r_list:any[] = [];
    const unique_list = Array.from(new Set(to_be_address));
    sns
      .names(unique_list)
      .then((result) => {
        result.forEach((r, i) => {
          r_list.push([unique_list[i], r === AddressZero ? "" : r]);
        });

        setResultList(r_list);

      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return <Container>

    <BackerNav to="/city-hall/governance" title={t('city-hall.sns')} mb="0"  />
    <StepContainer>
      <div>
        <Box>
          <StepTitle>{t('city-hall.sns')}</StepTitle>
          <TxBox
            value={areaValue}
            onChange={(e) => setAreaValue(e.target.value)}
            placeholder={`input SNS\ninput SNS\ninput SNS\n`} />
          <FlexLine>
            <Button
              onClick={onParse}
              disabled={loading}
              className="submitBtn"
            >
              SNS
              {/*{loading ? <Loading /> : <span>Parse</span>}*/}
            </Button>
            <Button
              onClick={onAddress}
              disabled={loading}
              className="submitBtn"
            >
              Address
              {/*{loading ? <Loading /> : <span>Parse</span>}*/}
            </Button>
          </FlexLine>

        </Box>
        {
          resultList.length > 0 &&<TableBox>
            <table>
              <tr>
                <th>{type ==="sns"?"SNS":"Address"}</th>
                <th>{type ==="sns"?"Address":"SNS"}</th>
              </tr>
              {
                resultList.map((item,index) => (<tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                </tr>))
              }

            </table>
          </TableBox>
        }

      </div>


    </StepContainer>


  </Container>
}
