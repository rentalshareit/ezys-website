import React, { useState, useCallback } from "react";
import { Tag } from "antd";
import PropTypes from "prop-types";

const { CheckableTag } = Tag;

const FilterChip = ({ options, defaultValue, onChange }) => {
  const [selectedTag, setSelectedTag] = useState(defaultValue);

  const handleChange = useCallback(
    (tag, checked) => {
      if (checked) {
        setSelectedTag(tag);
        onChange?.(tag);
      } else if (tag === selectedTag) {
        // If unchecking the currently selected tag, clear selection
        setSelectedTag(null);
        onChange?.(null);
      }
    },
    [selectedTag, onChange]
  );

  return (
    <div
      className="filter-chip-container"
      style={{
        marginBottom: 16,
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <h3 style={{ color: "rgb(13, 148, 136)" }}>Filter By:</h3>
      <div>
        {options.map((tag) => (
          <CheckableTag
            key={tag.value}
            checked={selectedTag?.value === tag.value}
            onChange={(checked) => handleChange(tag, checked)}
            style={{
              padding: "4px 12px",
              borderRadius: "16px",
              cursor: "pointer",
              fontSize: "14px",
              border: "1px solid #d9d9d9",
            }}
          >
            {tag.label}
          </CheckableTag>
        ))}
      </div>
    </div>
  );
};

FilterChip.propTypes = {
  // Array of options with label and value
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  // Default selected option
  defaultValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
  // Callback when selection changes
  onChange: PropTypes.func,
};

FilterChip.defaultProps = {
  defaultValue: null,
  onChange: () => {},
};

export default FilterChip;
