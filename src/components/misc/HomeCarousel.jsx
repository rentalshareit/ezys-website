import React, { useState } from "react";
import { Carousel } from "antd";
import coverImg from "@/images/gaming_banner.jpeg";
import deliveryImg from "@/images/delivery.png";
import discountImg from "@/images/discount_banner.png";
import noDepositImg from "@/images/no_deposit.png";

const bannerImages = [discountImg, coverImg, deliveryImg, noDepositImg];

const HomeCarousel = () => {
  const [carouselOrder] = useState(() => {
    const arr = [0, 1, 2, 3];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  return (
    <Carousel autoplay autoplaySpeed={3000} dots={false}>
      {carouselOrder.map((index) => (
        <div className="banner-img" key={index}>
          <img src={bannerImages[index]} alt="" />
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;
