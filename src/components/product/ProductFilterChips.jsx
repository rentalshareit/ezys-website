import React, { useMemo } from "react";
import PropTypes from "prop-types";
import FilterChip from "@/components/common/FilterChip";
import { useDispatch } from "react-redux";
import { Space } from "antd";

// Filter configurations for different categories
const FILTER_CONFIG = {
  gaming_consoles: {
    options: [
      { label: "PS4 Slim", value: "ps4slim" },
      { label: "PS4 Pro", value: "ps4pro" },
      { label: "PS5 Digital", value: "ps5digital" },
    ],
  },
  games_controllers: {
    options: [
      { label: "Digital Games", value: "digital" },
      { label: "Disc Games", value: "disc" },
    ],
  },
};

const ProductFilterChips = ({ category, onFilterChange }) => {
  // Get the appropriate filters for the current category
  const filter = useMemo(() => {
    const formattedCategory =
      category
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_") || "";
    const categoryFilter = FILTER_CONFIG[formattedCategory] || null;
    return categoryFilter;
  }, [category]);

  if (!filter) return null;

  return (
    <div className="product-filter-chips">
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <div className="filter-group">
          <FilterChip
            options={filter?.options || []}
            onChange={(selected) => onFilterChange(selected?.value || null)}
          />
        </div>
      </Space>
    </div>
  );
};

ProductFilterChips.propTypes = {
  category: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default ProductFilterChips;
