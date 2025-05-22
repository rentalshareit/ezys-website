import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/getGoogleReviews", {
          method: "GET",
          headers: {
            "X-Api-Key": "API_KEY",
          },
        });
        const data = await response.json();
        if (data.body.result && data.body.result.reviews) {
          setReviews(
            data.body.result.reviews.map((r, index) => ({
              reviewId: index,
              reviewer: {
                profilePhotoUrl: r.profile_photo_url,
                displayName: r.author_name,
              },
              starRating: r.rating,
              comment: r.text,
              createTime: new Date(r.time * 1000),
            }))
          );
        } else {
          console.error("No reviews found");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
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
        {reviews.length > 0 ? (
          <div className="google-reviews-carousel">
            {" "}
            <ReactGoogleReviews layout="carousel" reviews={reviews} />
          </div>
        ) : (
          <div
            className="ezys-spinner"
            style={{ height: "unset", marginTop: "5rem" }}
          >
            <Spin size="large" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default GoogleReviews;
