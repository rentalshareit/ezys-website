import React, { useCallback, useMemo, useState } from "react";
import PropType from "prop-types";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Menu,
  Modal,
  Typography,
  List,
  Space,
} from "antd";
import {
  EllipsisOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  EyeInvisibleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import ProductAvailability from "./ProductAvailability";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useBasket } from "@/hooks";
import useProductAvailability from "@/hooks/useProductAvailability";
import { calculateProductPrice } from "@/helpers/utils";
import { ViewGamesModal, PackageInfoModal } from "@/components/common";
import ProductSkeleton from "./ProductSkeleton";
import {
  priceContainerStyles,
  priceStyles,
  daysTextStyles,
} from "./ProductFeatured.styles";

const { Title, Text, Paragraph } = Typography;

const CartButton = ({ inCart, available, category, productId, onClick }) => {
  const baseProps = {
    id: `btn-add-basket-${category}-${productId}`,
    type: "text",
    style: {
      width: 30,
      height: 30,
      padding: 0,
    },
    onClick: (e) => {
      e.stopPropagation();
      onClick?.(e);
    },
    onMouseDown: (e) => e.stopPropagation(),
  };
  if (!available) {
    return (
      <Button
        {...baseProps}
        disabled
        style={{
          ...baseProps.style,
          backgroundColor: "#818181",
        }}
        icon={<EyeInvisibleOutlined style={{ fontSize: 18 }} />}
      />
    );
  }

  if (!inCart) {
    return (
      <Button
        {...baseProps}
        style={{
          ...baseProps.style,
          backgroundColor: "rgb(13, 148, 136)",
        }}
        icon={<PlusOutlined style={{ fontSize: 18 }} />}
      />
    );
  }
  return (
    <Button
      {...baseProps}
      style={{
        ...baseProps.style,
        backgroundColor: "rgba(240, 63, 63, 0.99)",
      }}
      icon={<MinusOutlined style={{ fontSize: 18 }} />}
    />
  );
};

const ProductActionButton = ({
  isOutOfStock,
  isInBasket,
  onClick,
  product,
}) => {
  const { id: productId, category } = product;
  const getButtonType = () => {
    if (isOutOfStock || isInBasket) {
      return "default";
    }
    return "primary";
  };

  const getButtonText = () => {
    if (isOutOfStock) {
      return "Out Of Stock";
    }
    if (isInBasket) {
      return "Remove From Cart";
    }
    return "Add To Cart";
  };

  return (
    <CartButton
      inCart={isInBasket}
      available={!isOutOfStock}
      category={category}
      productId={productId}
      onClick={onClick}
    />
  );
};

const ProductPrice = ({ original, days, discounted }) => (
  <div style={priceContainerStyles}>
    {original !== discounted ? (
      <>
        <span
          style={{
            ...priceStyles,
            textDecoration: "line-through",
            color: "#999",
          }}
        >
          {original}
        </span>
        <span style={{ ...priceStyles, paddingLeft: "0.5rem" }}>
          {discounted}
        </span>
      </>
    ) : (
      <span style={priceStyles}>{original}</span>
    )}
    <br />
    <span style={daysTextStyles}>{`for ${days} days`}</span>
  </div>
);

const ProductCardContent = ({
  product,
  isOutOfStock,
  isLoading,
  rentalPeriod,
}) => (
  <img
    src={product.image}
    style={{ width: "100%", height: "280px", objectFit: "contain" }}
    alt={product.name}
  />
);

const getDiscountBadgeText = (discount) => {
  if (!discount) return 0;
  return `${discount}% off`;
};

const getCardActions = ({
  isOutOfStock,
  isInBasket,
  onAddToBasket,
  product,
  original,
  rentalPeriod,
  discounted,
  onViewGames,
  onCheckAvailability,
  onPackageInfo,
  onCarouselPause,
  onCarouselResume,
}) => {
  const items = [];
  if (product.subscription) {
    items.push({
      key: "view_games",
      label: "View Games",
    });
  }

  items.push({
    key: "show_availability",
    label: "Check Availability",
  });

  if (product.included) {
    items.push({
      type: "divider",
    });
    items.push({
      key: "package_information",
      label: "Package Information",
    });
  }

  const handleMenuClick = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    switch (key) {
      case "view_games":
        onViewGames?.();
        break;
      case "show_availability":
        onCheckAvailability?.();
        break;
      case "package_information":
        onPackageInfo?.();
        break;
      default:
        break;
    }
  };

  return [
    <ProductActionButton
      key="action"
      isOutOfStock={isOutOfStock}
      isInBasket={isInBasket}
      onClick={onAddToBasket}
      product={product}
    />,
    isOutOfStock ? (
      <ProductAvailability
        key="availability"
        product={product}
        showAllSlotsLink={false}
      />
    ) : (
      <ProductPrice
        key="price"
        original={original}
        discounted={discounted}
        days={rentalPeriod.days}
      />
    ),
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      onOpenChange={(open) => {
        if (open) {
          onCarouselPause?.();
          console.log("Dropdown opened - carousel paused");
        } else {
          onCarouselResume?.();
          console.log("Dropdown closed - carousel resumed");
        }
      }}
      placement="bottomRight"
      trigger={["click"]}
      key="ellipsis"
      popupRender={(menu) => (
        <div
          className="product-featured-dropdown"
          style={{
            border: "1px solid #f1f0f0ff", // Grey border around dropdown
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {menu}
        </div>
      )}
      style={{ padding: 10, border: "2px solid #f0f0f0" }}
    >
      <Button
        type="text"
        size="small"
        icon={
          <EllipsisOutlined
            key="ellipsis"
            style={{ color: "rgb(13, 148, 136)", fontSize: "1.8rem" }}
          />
        }
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ padding: 0 }}
      />
    </Dropdown>,
  ];
};

const ProductFeatured = ({ product, onCarouselPause, onCarouselResume }) => {
  const { skeleton = false } = product;
  const { addToBasket, isItemOnBasket } = useBasket();
  const { isProductAvailable, isLoading } = useProductAvailability();
  const hideOutOfStock = useSelector((state) => state.app.hideOutOfStock);
  const history = useHistory();
  const { rentalPeriod } = useSelector((state) => ({
    rentalPeriod: state.app.rentalPeriod,
  }));
  const [gamesModalVisible, setGamesModalVisible] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] =
    useState(false);

  // Modal handlers
  const handleViewGames = useCallback(() => {
    setGamesModalVisible(true);
  }, []);

  const handlePackageInfo = useCallback(() => {
    setPackageModalVisible(true);
  }, []);

  const handleCloseGamesModal = useCallback(() => {
    setGamesModalVisible(false);
  }, []);

  const handleClosePackageModal = useCallback(() => {
    setPackageModalVisible(false);
  }, []);

  const handleCheckAvailability = useCallback(() => {
    setAvailabilityModalVisible(true);
  }, []);

  const handleCloseAvailabilityModal = useCallback(() => {
    setAvailabilityModalVisible(false);
  }, []);

  const onClickItem = useCallback(() => {
    if (!product || skeleton) return;
    history.push(`/product/${product.id}`);
  }, [product, skeleton, history]);

  const isItemAlreadyInBasket = isItemOnBasket(product.id);

  const isItemOutOfStock = useMemo(() => {
    if (product.skeleton) {
      return false;
    }
    return !isProductAvailable(product, ...rentalPeriod.dates);
  }, [isProductAvailable, product, rentalPeriod]);

  const onAddToBasket = useCallback(
    (e) => {
      e.stopPropagation();
      addToBasket(product);
    },
    [product, addToBasket]
  );

  const [original, discounted] = calculateProductPrice(
    product,
    rentalPeriod.days,
    true
  );

  if (hideOutOfStock && isItemOutOfStock) {
    return null;
  }

  if (skeleton || isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div>
      <Badge
        color="rgb(228, 165, 31)"
        style={{ fontSize: "1.2rem", fontWeight: 800 }}
        count={product.discount ? `${product.discount}% off` : 0}
      >
        <Card
          id={`card-view-product-details-${product.category}-${product.id}`}
          hoverable
          variant="borderless"
          onClick={onClickItem}
          style={{
            width: 280,
            height: 420,
            display: "flex",
            padding: "5px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          size="small"
          actions={getCardActions({
            isOutOfStock: isItemOutOfStock,
            isInBasket: isItemAlreadyInBasket,
            onAddToBasket: onAddToBasket,
            product,
            original,
            rentalPeriod,
            discounted,
            onCheckAvailability: handleCheckAvailability,
            onViewGames: handleViewGames,
            onPackageInfo: handlePackageInfo,
            onCarouselPause,
            onCarouselResume,
          })}
          cover={
            <ProductCardContent
              product={product}
              isOutOfStock={isItemOutOfStock}
              isLoading={isLoading}
              rentalPeriod={rentalPeriod}
            />
          }
        >
          <Card.Meta title={product.name} description={product.brand} />
        </Card>
      </Badge>

      {/* Add availability modal here */}
      <ProductAvailability
        product={product}
        isModalVisible={availabilityModalVisible}
        onModalClose={handleCloseAvailabilityModal}
        showAllSlotsLink={false}
        showNextDateLink={false}
      />

      <ViewGamesModal
        visible={gamesModalVisible}
        onClose={handleCloseGamesModal}
        product={product}
      />
      <PackageInfoModal
        product={product}
        visible={packageModalVisible}
        onClose={handleClosePackageModal}
      />
    </div>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    image: PropType.string,
    name: PropType.string,
    id: PropType.string,
    brand: PropType.string,
    category: PropType.string,
    discount: PropType.number,
    skeleton: PropType.bool,
  }).isRequired,
};

export default ProductFeatured;
