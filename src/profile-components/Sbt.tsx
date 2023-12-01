import styled from 'styled-components';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import RhtArr from 'assets/Imgs/profile/right.svg';

import 'swiper/css';
import 'swiper/css/navigation';

const Box = styled.div`
  width: 100%;
  min-height: 10px;
  display: flex;
  align-items: center;
  position: relative;
  .mySwiper2 {
  }
  .swiper-slide {
    display: flex;
    width: 70px;
  }

  .lft2 {
    position: relative;
    width: 16px;
    height: 16px;
    margin-top: 5px;
    background: url(${RhtArr}) no-repeat;
    background-size: 100%;
    transform: rotate(180deg);
    &:after {
      content: '';
    }
  }
  .rht2 {
    position: relative;
    margin-left: 5px;
    margin-top: 5px;
    width: 16px;
    height: 16px;
    background: url(${RhtArr}) no-repeat;
    background-size: 100%;
    &:after {
      content: '';
    }
  }
`;
const InnerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .imgBox {
    width: 36px;
    height: 36px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 120px;
      border: 2px solid #fff;
    }
  }
  .fst {
    position: relative;
  }
  .snd {
    margin-left: -20px;
    z-index: 10;
    position: relative;
  }
  .thd {
    margin-left: -20px;
    z-index: 14;
    width: 36px;
    height: 36px;
    background: #f0e9ff;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
  }
`;

const OuterBox = styled.div`
  width: 440px;
  padding: 0 20px;
  box-sizing: border-box;
`;
const LiBox = styled.div`
  width: 70px;
  & > div {
    display: inline-block;
    flex-grow: 0;
  }
  .name {
    width: 100%;
    padding-top: 15px;
    text-align: center;
  }
`;

interface Iprops {
  list: any[];
}

export default function Sbt(props: Iprops) {
  const { list } = props;

  return (
    <Box>
      <div className={`swiper-button-prev lft2 swiper-button-prev_nft2`}></div>
      <OuterBox>
        <Swiper
          className="mySwiper2"
          slidesPerView="auto"
          navigation={{
            nextEl: `.swiper-button-next_nft2`,
            prevEl: `.swiper-button-prev_nft2`,
          }}
          modules={[Navigation]}
          spaceBetween={20}
        >
          {!!list?.length &&
            list.map((item, index) => (
              <SwiperSlide key={`sbt_${index}`}>
                <LiBox>
                  <div>
                    <InnerBox>
                      {!!item && item?.tokens[0] && (
                        <div className="imgBox fst">
                          <img src={item?.tokens[0]?.url} alt="" />
                        </div>
                      )}
                      {item?.tokens[1] && (
                        <div className="imgBox snd">
                          <img src={item?.tokens[1]?.url} alt="" />
                        </div>
                      )}
                      {item.tokens.length <= 3 && item?.tokens[2] && (
                        <div className="imgBox snd">
                          <img src={item?.tokens[1]?.url} alt="" />
                        </div>
                      )}
                      {item.tokens.length > 3 && <div className="imgBox thd">+ {item.tokens.length - 2}</div>}
                    </InnerBox>
                    <div className="name">{item?.category}</div>
                  </div>
                </LiBox>
              </SwiperSlide>
            ))}
        </Swiper>
      </OuterBox>
      <div className={`swiper-button-next rht2 swiper-button-next_nft2`}></div>
    </Box>
  );
}
