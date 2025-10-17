import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, List, Card, Spin, Empty } from "antd";
import PropType from "prop-types";
import useProductAvailability from "@/hooks/useProductAvailability";
import dayjs, { parseDate } from "@/helpers/dayjs";

const ProductAvailability = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAvailableSlots } = useProductAvailability();

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
        Check Availability
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
