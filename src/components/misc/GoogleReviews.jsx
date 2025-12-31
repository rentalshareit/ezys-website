import React, { useEffect, useState } from "react";
import { Card, Spin, Alert, Flex } from "antd";
import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";
import { set } from "date-fns";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/getGoogleReviews", {
          method: "GET",
          headers: {
            "X-Api-Key": "API_KEY",
          },
        });

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.body?.error_message) {
          console.error("Error fetching reviews:", data.body.error_message);
          setError("Failed to load reviews. Please try again later.");
        } else if (
          data.body?.result?.reviews &&
          data.body.result.reviews.length > 0
        ) {
          setReviews(
            data.body.result.reviews.map((r, index) => ({
              reviewId: index,
              reviewer: {
                profile_photo_url: r.profile_photo_url,
                displayName: r.author_name,
              },
              starRating: r.rating,
              comment: r.text,
              createTime: new Date(r.time * 1000),
            }))
          );
          setError(null);
        } else {
          setError("No reviews found.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <Card
        title="Customer Testimonials"
        styles={{
          header: {
            backgroundColor: "rgb(13, 148, 136)",
            color: "#fff",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "1.6rem",
          },
        }}
      >
        <div
          className="ezys-spinner"
          style={{ height: "unset", marginTop: "5rem" }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Customer Testimonials"
      styles={{
        header: {
          backgroundColor: "rgb(13, 148, 136)",
          color: "#fff",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "1.6rem",
        },
      }}
    >
      {error ? (
        <Flex justify="center" align="center" style={{ padding: "2rem 1rem" }}>
          <Alert
            message="Reviews Unavailable"
            description={error}
            type="error"
            showIcon
          />
        </Flex>
      ) : reviews.length > 0 ? (
        <div className="google-reviews-carousel">
          <ReactGoogleReviews layout="carousel" reviews={reviews} />
        </div>
      ) : null}
    </Card>
  );
};

export default GoogleReviews;
