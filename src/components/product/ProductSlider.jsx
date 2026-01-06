import React, { useState, useCallback } from "react";
import { FeaturedProduct } from "@/components/product";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import the default styles

const ProductSlider = ({ products, itemsToShow }) => {
  const [isPaused, setIsPaused] = useState(false);
  const { visible: disclaimerVisible } = useSelector(
    (state) => state.app.subscriptionDisclaimerModal || {}
  );
  const isSkeleton = products.some((product) => product.skeleton);
  // Define a single, default responsive configuration
  const responsive = {
    allDevices: {
      breakpoint: { max: 4000, min: 0 }, // Covers all screen sizes
      items: itemsToShow, // Always show n items
      slidesToSlide: Math.min(itemsToShow, 2), // Always slide n items at a time
    },
  };

  // Pause carousel (call from FeaturedProduct)
  const pauseCarousel = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Resume carousel (optional)
  const resumeCarousel = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <Carousel
      arrows={false}
      responsive={responsive}
      infinite={!isSkeleton} // Enable infinite loop
      autoPlay={!isSkeleton && !isPaused && !disclaimerVisible} // Auto-scroll
      autoPlaySpeed={isSkeleton ? 0 : 5000} // Speed of auto-scroll in ms
      keyBoardControl={true} // Allow keyboard navigation
      transitionDuration={isSkeleton ? 0 : 1000} // Duration of the slide animation in ms
      showDots={false} // Show navigation dots
      itemClass="product-slider-item"
      swipeable={false}
      draggable={false}
      pauseOnHover={true}
      pauseOnFocus={true}
    >
      {products.map((product, index) => (
        <FeaturedProduct
          key={product.id}
          product={product}
          onCarouselPause={pauseCarousel}
          onCarouselResume={resumeCarousel}
        />
      ))}
    </Carousel>
  );
};

export default ProductSlider;
