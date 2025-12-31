import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Modal, List, Card, Spin, Empty } from "antd";
import PropTypes from "prop-types";
import useProductAvailability from "@/hooks/useProductAvailability";
import dayjs, { parseDate } from "@/helpers/dayjs";
import { formatDateWithOrdinal } from "@/components/common";

const ProductAvailability = ({
  product,
  showNextDateLink = true,
  showAllSlotsLink = true,
  onNextDateClick, // Callback for date picker focus
  className = "",
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAvailableSlots } = useProductAvailability();
  const [nextAvailableDate, setNextAvailableDate] = useState(null);

  useEffect(() => {
    const fetchNextAvailableDate = async () => {
      if (getAvailableSlots) {
        const slots = await getAvailableSlots(product);
        if (slots && slots.length > 0) {
          setNextAvailableDate(slots[0].start);
        } else {
          setNextAvailableDate(null);
        }
      }
    };
    fetchNextAvailableDate();
  }, [getAvailableSlots, product]);

  useEffect(() => {
    const handleModalClick = (e) => {
      const target = e.target;
      // Don't stop propagation if clicking the close button
      if (target.closest(".ant-modal-close")) {
        return;
      }
      if (target.closest(".availability-modal-wrapper")) {
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleModalClick, true);

    return () => {
      document.removeEventListener("click", handleModalClick, true);
    };
  }, []);

  const loadAvailableSlots = useCallback(async () => {
    setLoading(true);
    try {
      const slots = await getAvailableSlots(product);
      const formattedSlots = slots.map((slot) => ({
        ...slot,
        startDate: parseDate(slot.start, "DD/MM/YYYY"),
        endDate: parseDate(slot.end, "DD/MM/YYYY"),
      }));
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error("Failed to load available slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [product, getAvailableSlots]);

  const showModal = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsModalVisible(true);
      loadAvailableSlots();
    },
    [loadAvailableSlots]
  );

  const handleNextDateClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (onNextDateClick) {
        onNextDateClick(nextAvailableDate, product);
      }
    },
    [nextAvailableDate, product, onNextDateClick]
  );

  const handleCancel = useCallback((e) => {
    e.stopPropagation();
    setIsModalVisible(false);
  }, []);

  const renderLinks = () => {
    const links = [];

    if (showNextDateLink && nextAvailableDate) {
      links.push(
        <Button
          key="next-date"
          type="link"
          onClick={handleNextDateClick}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            padding: 0,
            fontSize: "10px",
            fontWeight: 600,
            gap: 1,
            color: "rgb(13, 148, 136)",
          }}
        >
          <span>Book for</span> {formatDateWithOrdinal(nextAvailableDate)}
        </Button>
      );
    }

    if (showAllSlotsLink) {
      links.push(
        <Button
          key="all-slots"
          type="link"
          onClick={showModal}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ padding: 0, fontSize: "12px" }}
        >
          Check All Available Slots
        </Button>
      );
    }

    return links;
  };

  return (
    <>
      <div className={`product-availability-links ${className}`}>
        {renderLinks()}
      </div>

      <Modal
        title={`Available Rental Slots - ${product.name}`}
        styles={{ header: { color: "rgb(13, 148, 136)!important" } }}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="availability-modal-wrapper"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      >
        <Spin spinning={loading}>
          {availableSlots.length > 0 ? (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={availableSlots}
              renderItem={(slot) => (
                <List.Item>
                  <Card size="small">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          From: {slot.startDate.format("DD MMM YYYY")}
                        </div>
                        <div style={{ fontWeight: "bold" }}>
                          To: {slot.endDate.format("DD MMM YYYY")}
                        </div>
                      </div>
                      <div>
                        {slot.endDate.diff(slot.startDate, "days")} days
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            !loading && (
              <Empty
                description="No available slots found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          )}
        </Spin>
      </Modal>
    </>
  );
};

ProductAvailability.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  showNextDateLink: PropTypes.bool,
  showAllSlotsLink: PropTypes.bool,
  onNextDateClick: PropTypes.func, // Callback when next date clicked
  className: PropTypes.string,
};

ProductAvailability.defaultProps = {
  showNextDateLink: true,
  showAllSlotsLink: true,
};

export default ProductAvailability;
