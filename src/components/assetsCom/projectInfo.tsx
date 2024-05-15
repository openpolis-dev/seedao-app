import styled from 'styled-components';
import { useAuthContext } from '../../providers/authProvider';

const Box = styled.div`
  background: var(--bs-box-background);
  padding: 30px 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 40px;
  box-shadow: var(--box-shadow);
`;

const ImgBox = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
`;
const MidBox = styled.div`
  width: 65%;
  @media (max-width: 1600px) {
    width: 100%;
  }
`;
const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  .title {
    //color: #29282F;
    color: var(--bs-body-color_active);
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  }
  .rhtLine {
    display: flex;
    gap: 10px;
  }
  .tag {
    min-width: 80px;
    height: 24px;
    line-height: 22px;
    border: 1px solid #0085ff;
    text-align: center;
    color: #0085ff;
    font-size: 14px;
    border-radius: 4px;
  }
  .cat {
    color: var(--bs-body-color_active);
    border: 1px solid #9ca4ab;
    background: rgba(217, 217, 217, 0.27);
  }
  .status {
    border: 1px solid #5200ff;
    background: #5200ff;
    color: #fff;
  }
`;

const UlBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--menu-color);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  flex-wrap: wrap;
  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .lft {
    margin-right: 20px;
  }
  .tit {
    white-space: nowrap;
  }
  .rht {
    & > div {
      white-space: nowrap;
    }
  }
`;

const TipsBox = styled.div`
  color: #5200ff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.07px;
`;

export default function ProjectInfo() {
  const {
    state: { theme },
  } = useAuthContext();

  return (
    <Box>
      <ImgBox>
        <img src="" alt="" />
      </ImgBox>
      <MidBox>
        <FlexBox>
          <div className="title">香港Web3嘉年华参会&聚会提案</div>
          <div className="rhtLine">
            <div className="tag">SIP-111</div>
            <div className="tag cat">P1 提案</div>
            <div className="tag status">进行中</div>
          </div>
        </FlexBox>
        <UlBox>
          <li>
            <div className="lft">
              <div className="tit">项目预算</div>
              <div className="tit">当前已预支</div>
            </div>
            <div className="rht">
              {/*项目预算*/}
              <div>5000 SCR，1000 USDT</div>
              {/*当前已预支*/}
              <div>0 SCR，200 USDT</div>
            </div>
          </li>

          <li>
            <div className="lft">
              <div className="tit">预付比例</div>
              <div className="tit">预算余额</div>
            </div>
            <div className="rht">
              {/*预付比例*/}
              <div>50%</div>
              {/*预算余额*/}
              <div>2500 SCR，500 USDT</div>
            </div>
          </li>

          <li>
            <div className="lft">
              <div className="tit">可预支数额</div>
              <div className="tit">可预支余额</div>
            </div>
            <div className="rht">
              {/*可预支数额*/}
              <div>2500 SCR，500 USDT</div>
              {/*可预支余额*/}
              <div>2500 SCR，500 USDT</div>
            </div>
          </li>
        </UlBox>
        <TipsBox>预付比例之之外的预算不可预支，请通过提案结项申请</TipsBox>
      </MidBox>
    </Box>
  );
}
