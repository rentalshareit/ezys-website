import React from "react";
import { Card } from "antd";
import Skeleton from "react-loading-skeleton";
import { skeletonStyles } from "./ProductFeatured.styles";

const ProductSkeleton = () => (
  <Card
    hoverable
    variant="borderless"
    style={{
      width: 280,
      height: 420,
      display: "flex",
      padding: "5px",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
    size="small"
    actions={[
      <Skeleton key="action1" style={skeletonStyles.base} />,
      <Skeleton key="action2" style={skeletonStyles.base} />,
    ]}
    cover={<Skeleton style={skeletonStyles.image} />}
  >
    <Card.Meta
      title={<Skeleton />}
      description={<Skeleton style={skeletonStyles.brand} />}
    />
  </Card>
);

export default ProductSkeleton;
