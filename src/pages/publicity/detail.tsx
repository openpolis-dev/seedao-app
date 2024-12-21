import styled, { css } from "styled-components";
import BasicModal from "../../components/modals/basicModal";
import { IPushDisplay } from "../../type/push.type";
export const PushItemBottomLeft = styled.div`
  .name {
    font-size: 14px;
    color: var(--bs-body-color_active);
  }
  .date {
    font-size: 12px;
    color: var(--bs-body-color);
  }
`;


const PushModal = styled(BasicModal)`
  padding: 0;
  width: 480px;
`;

export const PushItemTop = styled.div`
  padding: 16px 24px;
`;

const ClipStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const PushItemTitle = styled.div`
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  line-height: 22px;
  &.clip {
    ${ClipStyle}
  }
`;

export const PushItemContent = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--bs-body-color);
  margin-block: 8px;
  &.clip {
    ${ClipStyle}
  }
`;

export const PushItemBottom = styled.div`
  border-top: 1px solid var(--bs-border-color);
  display: flex;
  justify-content: space-between;
  padding-block: 9px;
  margin-inline: 24px;
  align-items: center;
`;

interface IProps {
  handleClose: () => void;
}

export default function DetailModal({handleClose}: IProps){
   return <PushModal handleClose={handleClose}>
     <PushItemTop>
       <PushItemTitle>标题内容</PushItemTitle>
       <PushItemContent>内容内容内容内容内容内容</PushItemContent>
     </PushItemTop>
     <PushItemBottom>
       <PushItemBottomLeft>
         <div className="name">wendychaung.seedao</div>
         <div className="date">2025-02-03 23:59</div>
       </PushItemBottomLeft>
     </PushItemBottom>
   </PushModal>;
}
