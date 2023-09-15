import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import InputNumber from 'components/inputNumber';
import LftImg from '../assets/images/left.svg';
import RhtImg from '../assets/images/right.svg';

const Box = styled.div`
  display: flex;
  //justify-content: space-between;
  align-items: center;

  margin-top: 40px;
  width: 100%;
  a {
    text-decoration: none;
    //color: #616666;
    width: 32px;
    height: 32px;
    display: inline-block;
    margin: 0 4px;
  }
  .pagination {
    display: flex;
    align-items: center;
  }

  .page-break {
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    margin-right: -4px;
  }
  .page-left {
    background: url(${LftImg}) no-repeat center !important;
    margin-right: 5px;
  }
  .page-right {
    background: url(${RhtImg}) no-repeat center !important;
  }

  .page-link,
  .page-left,
  .page-right {
    width: 32px;
    height: 32px;
    background: #fff;
    border: 0;
    text-align: center;
    line-height: 32px;
    padding: 0;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    color: #616666;
    border: 1px solid var(--bs-primary);
    border-radius: 4px;
  }

  .next {
    display: none;
  }

  .page-link {
    &:hover {
      background: var(--bs-primary);
      color: #fff;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .disabled {
    .pageL {
      color: #f2f2f2 !important;
    }
  }

  .active {
    .page-link {
      background: var(--bs-primary);
      color: #fff;
    }
  }
`;
// const NumBox = styled.div`
//   font-size: 14px;
//   font-weight: 400;
//   color: #949999;
// `;

const GoToBox = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 12px;
  //border: 1px solid var(--bs-primary);

  padding: 0 !important;

  input {
    width: 64px;
    height: 32px;
    background: transparent;
    text-align: center;
    font-size: 14px;
    color: #000;
    border: 1px solid var(--bs-primary);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    &:focus {
      outline: none;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }

  .btn {
    width: 32px;
    height: 32px;
    text-align: center;
    padding: 0;
    border-radius: 0;
    font-size: 14px;
    background: var(--bs-primary);
    color: #fff;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;
const RhtBox = styled.div`
  display: flex;
`;

interface Props {
  itemsPerPage: number;
  total: number;
  current: number;
  handleToPage: (a: number) => void;
  handlePageSize?: (a: number) => void;
}

const Page: FC<Props> = ({ itemsPerPage, total, handleToPage, current }) => {
  const [pageCount, setPageCount] = useState(0);
  const [curr, setCurr] = useState(0);
  const [pageToGo, setPageToGo] = useState('');
  // const [show, setShow] = useState(false);
  const MyPaginate = ReactPaginate as any;

  // useEffect(() => {
  //   document.addEventListener('click', (e) => {
  //     setShow(false);
  //   });
  // }, []);

  useEffect(() => {
    setPageCount(Math.ceil(total / itemsPerPage));
  }, [itemsPerPage, total]);

  useEffect(() => {
    // handleToPage(current);
    setCurr(current);
  }, [current]);

  const handlePageClick = (event: { selected: number }) => {
    // handleToPage((event as any).selected +1);
    setCurr((event as any).selected);
    handleToPage((event as any).selected);
  };
  const handleInput = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    const val = Number(value);

    if (val > pageCount || val < 1) {
      setPageToGo('');
    } else {
      setPageToGo(val.toString());
    }
  };
  const handleToGo = () => {
    const pg = Number(pageToGo) - 1;
    setCurr(pg);
  };

  return (
    <Box>
      {/*<NumBox>*/}
      {/*    Total <span>{total}</span> results*/}
      {/*</NumBox>*/}
      <RhtBox>
        <MyPaginate
          previousLabel=""
          nextLabel=""
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-left"
          previousLinkClassName="pageL"
          nextClassName="page-right"
          nextLinkClassName="pageR"
          breakLabel="..."
          breakClassName="page-break"
          breakLinkClassName="page-break"
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={(e: any) => handlePageClick(e)}
          containerClassName="pagination"
          activeClassName="active"
          forcePage={curr}
        />
        <GoToBox>
          <InputNumber
            value={pageToGo}
            onChange={handleInput}
            placeholder="Page"
            onWheel={(e) => (e.target as any).blur()}
          />
          <Button className="btn" onClick={() => handleToGo()}>
            Go
          </Button>
        </GoToBox>
      </RhtBox>
    </Box>
  );
};
export default Page;
