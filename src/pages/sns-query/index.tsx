import BackerNav from "../../components/common/backNav";
import styled from "styled-components";
import { ContainerPadding } from "../../assets/styles/global";
import sns from "@seedao/sns-js";
import { Input } from 'antd';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import { ethers } from "ethers";
import useToast, { ToastType } from "../../hooks/useToast";
import SubTabbar, { ITabItem } from "../../components/common/subTabbar";

const { TextArea } = Input;


const Container = styled.div`
  ${ContainerPadding};
  min-height: 100%;
    .TipsBox{
        color: #fb4e4e;
    }
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
    padding: 40px 0 20px;
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
 
    margin: 20px auto 40px;
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
        width: 100%;
        margin: 30px 0;
    }
`

const SubTabbarStyle = styled.ul`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  gap: 10px;
  color: var(--bs-body-color);
  padding-left: 30px;
    margin-bottom: 20px;
    width: 100%;
  li {
    //height: 30px;
    //line-height: 30px;
    //cursor: pointer;

      min-width: 160px;
      box-sizing: border-box;
      padding-inline: 10px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: var(--bs-menu-hover);
      border-radius: 100px;
      font-size: 14px;
      text-align: center;
      color: var(--bs-body-color_active);
      cursor: pointer;
      border: 1px solid var(--bs-background);
    &.selected {
      //color: var(--bs-body-color_active);
        background-color: var(--bs-primary);
        color: #fff;
    }
  }

  flex-wrap: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;


type TabKeyType = string | number;

interface IProps {
  defaultActiveKey: TabKeyType;
  tabs: ITabItem[];
  onSelect?: (v: TabKeyType) => void;
  [k: string]: any;
}


export default function SnsQuery(){
  const { t } = useTranslation();
  const [areaValue, setAreaValue] = useState("");

  const [resultList, setResultList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type,setType] = useState("sns");
  const [currentKey, setCurrentKey] = useState<TabKeyType>( 0);

  const tabs=[
    {
      title:t('SNS.snsTab'),
      type:"sns",
      key:0
    },
    {
      title:t('SNS.addressTab'),
      type:"address",
      key:1
    }
  ]
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
      showToast(t('SNS.noSNSINput'), ToastType.Danger);
      return;
    }
    setLoading(true);
    const r_list:any[] = [];
    const unique_list = Array.from(new Set(to_be_parsed));
    sns
      .resolves(unique_list)
      .then((result) => {
        result.forEach((r, i) => {
          // r_list.push([unique_list[i], r === AddressZero ? "<div class='TipsBox'>  未找到地址</div>" : r]);
          r_list.push([unique_list[i], r]);
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
      showToast(t('SNS.noAddressINput'), ToastType.Danger);
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

  const handleType = (v:number) =>{
    const item = tabs.find((item)=>item.key === v)
    setType(item?.type!)
    setCurrentKey(v)
    setAreaValue("")
  }

  return <Container>

    <BackerNav to="/city-hall/governance" title={t('city-hall.sns')} mb="0"  />
    <StepContainer>
      <div>
        <Box>
          <StepTitle>{t('city-hall.sns')}</StepTitle>

          <SubTabbarStyle >
            {tabs.map((item) => (
              <li key={item.key} onClick={() => handleType(item.key)} className={item.key === currentKey ? 'selected' : ''}>
                {item.title}
              </li>
            ))}
          </SubTabbarStyle>
          <TxBox
            value={areaValue}
            onChange={(e) => setAreaValue(e.target.value)}
            placeholder={type === "sns" ? t('SNS.inputSNS'):t('SNS.inputAddress')} />
          <FlexLine>
            <Button
                onClick={type ==="sns"?onParse:onAddress}
                disabled={loading}
                className="submitBtn"
              >
                {t('general.confirm')}
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
                  <td >
                    {
                      item[1] === AddressZero  && <span className="TipsBox">{t('SNS.notAddress')}

                    </span>
                    }
                    {
                       item[1] === ""  && <span className="TipsBox">{t('SNS.notSNS')}

                    </span>
                    }
                    {
                      (item[1] !== AddressZero &&  item[1] !== "") && <span> {item[1]}</span>
                    }

                   </td>
                </tr>))
              }

            </table>
          </TableBox>
        }

      </div>


    </StepContainer>


  </Container>
}
