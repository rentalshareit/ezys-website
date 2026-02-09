import React from "react";
import { Modal, Button, Typography, Space } from "antd";

const { Paragraph, Text } = Typography;

const subscriptionConfigs = {
  psn_deluxe: {
    name: "PSN Deluxe Subscription",
    vendor: "Sony",
    gamesCount: "100+ PS4/PS5 games",
    link: "/psn-games-catalog",
    description: "Access Sony's Catalog during rental period for free.",
  },
  meta_plus: {
    name: "Meta Plus Subscription",
    vendor: "Meta",
    gamesCount: "40+ VR games",
    link: "https://www.meta.com/experiences/section/746836817401205/",
    description: "Access Meta Quest+ VR games catalog during rental for free.",
  },
  ea_play: {
    name: "EA Play Subscription",
    vendor: "EA",
    gamesCount: "100+ EA titles",
    link: "https://www.ea.com/ea-play/games#playstation",
    description: "Access to EA play games during rental period for free.",
  },
};

const ViewGamesModal = ({ visible, onClose, product }) => {
  const subscriptionType = product.subscription_type;
  const config = subscriptionConfigs[subscriptionType] || {};

  return (
    <Modal
      title={`Subscription Games - ${config.name}`}
      open={visible}
      onCancel={onClose}
      wrapClassName="view-games-modal"
      footer={[
        <Button key="ok" onClick={onClose} style={{ marginRight: 8 }}>
          OK
        </Button>,
        <Button
          key="games-link"
          type="primary"
          href={config.link}
          target={subscriptionType !== "psn_deluxe" ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          View All Games →
        </Button>,
      ]}
      width={500}
      closable={false} // Hide X button since no title
    >
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <Paragraph strong>
          Product comes with <Text mark>{config.name}</Text>
        </Paragraph>

        <Paragraph>
          Access <strong>{config.gamesCount}</strong> from {config.vendor}'s
          Catalog during rental period for free.
        </Paragraph>

        <div
          style={{
            background: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            borderLeft: "4px solid rgb(13, 148, 136)",
          }}
        >
          <Text type="secondary">
            <strong>Important:</strong> Games library managed by {config.vendor}
            . Ezys has <strong>no control</strong> over game availability.
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Games rotate monthly. Some titles may leave/enter catalog during
            rental.
          </Text>
        </div>
        <Paragraph type="secondary" italic>
          {config.description}
        </Paragraph>
      </Space>
    </Modal>
  );
};

export default ViewGamesModal;
