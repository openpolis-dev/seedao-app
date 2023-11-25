import styled from 'styled-components';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

const Box = styled.div`
  width: 100%;
  min-height: 10px;
  display: flex;
  .mySwiper {
  }
  .swiper-slide {
    display: flex;
    width: 88px;
  }
`;
const OuterBox = styled.div`
  width: calc(100vw - 370px);
`;

const LiBox = styled.div`
  width: 88px;
  img {
    width: 88px;
    height: 88px;
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
export default function SeedList() {
  return (
    <Box>
      <OuterBox>
        <Swiper className="mySwiper" slidesPerView="auto" spaceBetween={20}>
          {[...Array(20)].map((item, index) => (
            <SwiperSlide key={index}>
              <LiBox>
                <img
                  src="https://img2.baidu.com/it/u=3012806272,1276873993&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
                  alt=""
                />
                <span>ID 3413</span>
              </LiBox>
            </SwiperSlide>
          ))}
        </Swiper>
      </OuterBox>
    </Box>
  );
}
