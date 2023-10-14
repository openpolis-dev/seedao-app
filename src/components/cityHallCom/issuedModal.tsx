import styled, { css } from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastType } from 'hooks/useToast';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn-cancel {
    margin-right: 20px;
  }
`;

const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(237, 241, 247);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: rgb(34, 43, 69);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

const CardBody = styled.div`
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
`;

const ItemBox = styled.div`
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
  }
  .title {
    margin-bottom: 10px;
  }
  ul {
    margin-top: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    input {
      margin-right: 10px;
      min-width: 650px;
    }
    span {
      margin-left: 10px;
    }
  }
`;

const ModalContainer = styled(Card)`
  min-width: 500px;
`;

interface Iprops {
  closeShow: () => void;
  handleConfirm: (data: string[]) => void;
  showToast: (msg: string, type: ToastType) => void;
}
export default function IssuedModal(props: Iprops) {
  const { t } = useTranslation();
  const { closeShow, handleConfirm } = props;

  const [value, setValue] = useState('');

  // const [memberList, setMemberList] = useState<string[]>(['']);

  // const handleInput = (e: ChangeEvent, index: number) => {
  //   const { value } = e.target as HTMLInputElement;
  //   let arr: string[] = [];
  //   arr = [...memberList];
  //   arr[index] = value;
  //   setMemberList(arr);
  // };

  // const handleAddMember = () => {
  //   setMemberList([...memberList, '']);
  // };

  // const removeMember = (index: number) => {
  //   const arr = [...memberList];
  //   arr.splice(index, 1);
  //   setMemberList(arr);
  // };

  const onClickConfirm = () => {
    const list = value.split(';');
    const _memberList: string[] = list.filter((item) => !!item);
    if (!_memberList.length) {
      return;
    }
    handleConfirm(_memberList);
  };

  return (
    <Mask>
      <ModalContainer>
        <CardHeader>{t('city-hall.SendCompleted')}</CardHeader>
        <CardBody>
          <ItemBox>
            <div className="title">{t('city-hall.FillInId')}</div>
            <Textarea onChange={(e) => setValue(e.target.value)} />
            {/* <ul>
              {memberList.map((item, index) => (
                <li key={`member_${index}`}>
                  <InputGroup fullWidth>
                    <input type="text" placeholder="Size small" value={item} onChange={(e) => handleInput(e, index)} />
                  </InputGroup>
                  <span onClick={() => handleAddMember()}>
                    <EvaIcon name="plus-outline" status="Primary" />
                  </span>
                  {!(!index && index === memberList.length - 1) && (
                    <span onClick={() => removeMember(index)}>
                      <EvaIcon name="minus-outline" status="Primary" />
                    </span>
                  )}
                </li>
              ))}
            </ul> */}
          </ItemBox>
        </CardBody>
        <CardFooter>
          <Button className="btn-cancel" onClick={() => closeShow()} variant="outline-primary">
            {t('general.cancel')}
          </Button>
          <Button onClick={onClickConfirm}>{t('general.confirm')}</Button>
        </CardFooter>
      </ModalContainer>
    </Mask>
  );
}

const Textarea = styled.textarea`
  ${({ theme }) => css`
    width: 100%;
    line-height: 22px;
    resize: none;
    height: 120px;
    overflow-y: auto;
    outline: none;
    padding: 10px;
    border-radius: 0.25rem;
    border-color: ${theme.inputBasicBorderColor};
    background-color: ${theme.inputBasicBackgroundColor};
    &:focus {
      border-color: rgb(161, 100, 255);
      box-shadow: 0 0 0 0.25rem rgba(161, 100, 255, 0.25);
    }
  `}
`;
