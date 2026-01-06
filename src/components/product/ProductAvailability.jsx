import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, List, Card, Spin, Empty } from "antd";
import PropTypes from "prop-types";
import useProductAvailability from "@/hooks/useProductAvailability";
import dayjs, { parseDate } from "@/helpers/dayjs";
import { formatDateWithOrdinal } from "@/components/common";

const ProductAvailability = ({
  product,
  showNextDateLink = true,
  showAllSlotsLink = true,
  className = "",
  isModalVisible = false,
  onModalClose = null,
}) => {
  const [internalModalVisible, setInternalModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAvailableSlots } = useProductAvailability();
  const [nextAvailableDate, setNextAvailableDate] = useState(null);

  // Use external modal visibility if provided
  const modalVisible = onModalClose ? isModalVisible : internalModalVisible;

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
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setInternalModalVisible(true);
      loadAvailableSlots();
    },
    [loadAvailableSlots]
  );

  const handleCancel = useCallback(() => {
    if (onModalClose) {
      onModalClose();
    } else {
      setInternalModalVisible(false);
    }
  }, [onModalClose]);

  const handleNextDateClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const datePicker = document.querySelector(
      ".ant-picker-range .ant-picker-input"
    );
    if (datePicker) {
      datePicker.click();
    }
  }, []);

  // When external modal becomes visible, load slots
  useEffect(() => {
    if (modalVisible && onModalClose) {
      loadAvailableSlots();
    }
  }, [modalVisible, onModalClose, loadAvailableSlots]);

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
          style={{
            padding: 0,
            fontSize: "10px",
            fontWeight: 600,
            color: "rgb(13, 148, 136)",
          }}
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
        open={modalVisible}
        onCancel={handleCancel}
        width={600}
        closable={false}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={handleCancel}
            style={{ marginRight: 8 }}
          >
            OK
          </Button>,
        ]}
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
  className: PropTypes.string,
  isModalVisible: PropTypes.bool,
  onModalClose: PropTypes.func,
};

export default ProductAvailability;
