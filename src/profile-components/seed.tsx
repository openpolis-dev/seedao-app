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
  .mySwiper {
  }
  .swiper-slide {
    display: flex;
    width: 54px;
  }

  .lft {
    position: relative;
    margin-right: 5px;
    background: url(${RhtArr}) no-repeat;
    width: 16px;
    height: 16px;
    margin-top: 10px;

    background-size: 100%;
    transform: rotate(180deg);
    &:after {
      content: '';
    }
  }
  .rht {
    position: relative;
    margin-left: 5px;
    margin-top: 10px;
    width: 16px;
    height: 16px;
    background: url(${RhtArr}) no-repeat;
    background-size: 100%;

    &:after {
      content: '';
    }
  }
`;
const OuterBox = styled.div`
  width: 440px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const LiBox = styled.div`
  width: 54px;
  img {
    width: 54px;
    height: 54px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding: 9px 0 0;
  }
`;

interface Iprops {
  list: any[];
}

export default function SeedList(props: Iprops) {
  const { list } = props;

  return (
    <Box>
      <div className={`swiper-button-prev lft swiper-button-prev_nft`}></div>

      <OuterBox>
        <Swiper
          className="mySwiper"
          slidesPerView="auto"
          navigation={{
            nextEl: `.swiper-button-next_nft`,
            prevEl: `.swiper-button-prev_nft`,
          }}
          modules={[Navigation]}
          spaceBetween={15}
        >
          {!!list?.length &&
            list.map((item: any, index: number) => (
              <SwiperSlide key={index}>
                <LiBox>
                  <img src={item.url} alt="" />
                  <span>ID {item.token_id}</span>
                </LiBox>
              </SwiperSlide>
            ))}
        </Swiper>
      </OuterBox>
      <div className={`swiper-button-next rht swiper-button-next_nft`}></div>
    </Box>
  );
}
