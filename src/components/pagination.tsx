import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';

const Box = styled.div`
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
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
    background: url('/images/left.svg') no-repeat center !important;
  }
  .page-right {
    background: url('/images/right.svg') no-repeat center !important;
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
    border: 1px solid #a16eff;
    border-radius: 4px;
  }

  .next {
    display: none;
  }

  .page-link {
    &:hover {
      background: #a16eff;
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
      background: #a16eff;
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
  margin-left: 12px;
  border: 1px solid #a16eff;
  border-radius: 3px;
  overflow: hidden;
  height: 33px;

  input {
    width: 64px;
    height: 32px;
    background: transparent;
    border: 0;
    text-align: center;
    font-size: 14px;
    color: #000;
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
    background: #a16eff;
    color: #fff;
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
}

const Page: FC<Props> = ({ itemsPerPage, total, handleToPage }) => {
  const [pageCount, setPageCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [pageToGo, setPageToGo] = useState('');
  const [show, setShow] = useState(false);
  const MyPaginate = ReactPaginate as any;

  useEffect(() => {
    document.addEventListener('click', (e) => {
      setShow(false);
    });
  }, []);

  useEffect(() => {
    setPageCount(Math.ceil(total / itemsPerPage));
  }, [itemsPerPage, total]);

  useEffect(() => {
    handleToPage(current);
  }, [current]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrent((event as any).selected);
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
    setCurrent(pg);
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
          forcePage={current}
        />
        <GoToBox>
          <input
            type="number"
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
