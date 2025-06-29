import React, { useState } from "react";
import { FeaturedProduct } from "@/components/product";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import the default styles

const ProductSlider = ({ products, itemsToShow }) => {
  // Define a single, default responsive configuration
  const responsive = {
    allDevices: {
      breakpoint: { max: 4000, min: 0 }, // Covers all screen sizes
      items: itemsToShow, // Always show n items
      slidesToSlide: Math.min(itemsToShow, 2), // Always slide n items at a time
    },
  };

  return (
    <Carousel
      arrows={false}
      responsive={responsive}
      infinite={true} // Enable infinite loop
      autoPlay={true} // Auto-scroll
      autoPlaySpeed={3000} // Speed of auto-scroll in ms
      keyBoardControl={true} // Allow keyboard navigation
      transitionDuration={1000} // Duration of the slide animation in ms
      showDots={false} // Show navigation dots
      itemClass="product-slider-item"
      swipeable={false}
      draggable={false}
      pauseOnHover={false}
    >
      {products.map((product) => (
        <FeaturedProduct key={product.id} product={product} />
      ))}
    </Carousel>
  );
};

export default ProductSlider;
