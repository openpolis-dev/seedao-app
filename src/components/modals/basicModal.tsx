import styled from 'styled-components';
import CloseIcon from 'assets/Imgs/close.svg';

interface Iprops {
  title?: string;
  handleClose?: () => void;
  children?: React.ReactNode;
  disabledClose?: boolean;
  [key: string]: any;
}

export default function BasicModal({ title, handleClose, children, disabledClose, ...rest }: Iprops) {
  return (
    <Mask>
      <CardBox {...rest}>
        {!disabledClose && (
          <img className="btn-close-modal" src={CloseIcon} alt="" onClick={() => handleClose && handleClose()} />
        )}
        {title && (
          <HeaderBox className="modal-header">
            <HeaderTitle>{title}</HeaderTitle>
          </HeaderBox>
        )}
        {children}
      </CardBox>
    </Mask>
  );
}

const Mask = styled.div`
  background: rgba(13, 12, 15, 0.8);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    margin-right: 20px;
  }
`;

const CardBox = styled.div`
  background: var(--bs-body-bg);
  border-radius: 16px;
  border: 1px solid var(--bs-border-color);
  padding: 20px 34px 40px;
  position: relative;
  .btn-close-modal {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;

const HeaderBox = styled.div`
  text-align: center;
  position: relative;
  font-size: 16px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: var(--bs-body-color_active);
  margin-bottom: 24px;
`;

const HeaderTitle = styled.div`
  text-align: center;
  width: 100%;
`;
