import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, List, Card, Spin, Empty } from "antd";
import PropType from "prop-types";
import useProductAvailability from "@/hooks/useProductAvailability";
import dayjs, { parseDate } from "@/helpers/dayjs";

const formatDateWithOrdinal = (dateString) => {
  const [day, month, year] = dateString.split("/"); // Split the date string (DD/MM/YYYY)

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (day) => {
    const dayNum = parseInt(day, 10);
    if (dayNum > 3 && dayNum < 21) return "th"; // Covers 4th-20th
    switch (dayNum % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ordinalSuffix = getOrdinalSuffix(day);

  // Convert the month number to a short month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month, 10) - 1];

  // Return the formatted date with superscript for the ordinal suffix
  return (
    <>
      {day}
      <sup>{ordinalSuffix}</sup> {monthName}
    </>
  );
};

const ProductAvailability = ({ product }) => {
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
          setNextAvailableDate(slots[0].start); // Assuming slots[0].start is in DD/MM/YYYY format
        }
      } else {
        setNextAvailableDate(null);
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

  const handleCancel = useCallback((e) => {
    e.stopPropagation();
    setIsModalVisible(false);
  }, []);

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {nextAvailableDate ? (
          <>
            <span style={{ fontWeight: 700, fontSize: "10px" }}>
              Available from {formatDateWithOrdinal(nextAvailableDate)}
            </span>
            <br />
            Check Availability
          </>
        ) : (
          "Check Availability"
        )}
      </Button>

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
  product: PropType.shape({
    id: PropType.string.isRequired,
    name: PropType.string.isRequired,
  }).isRequired,
};

export default ProductAvailability;
