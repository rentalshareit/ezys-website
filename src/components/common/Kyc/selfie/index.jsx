import React, { useState, useCallback } from "react";
import Webcam from "react-webcam";
import firebase from "@/services/firebase";

const SelfieCapture = ({ onNext, onPrev, orderId }) => {
  const [image, setImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const webcamRef = React.useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const uploadToFirebase = async () => {
    if (!image) return;

    try {
      const downloadUrl = await firebase.uploadBase64Image(
        "selfie",
        `orders/${orderId}/selfie`,
        image
      );
      setUploadedUrl(downloadUrl);
    } catch (error) {
      console.error("Error uploading selfie:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h6>Click Your Picture</h6>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {!image && !uploadedUrl && (
              <Webcam
                audio={false}
                height={168}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
              />
            )}

            {image && !uploadedUrl && (
              <img src={image} alt="Captured Selfie" width={220} />
            )}

            {uploadedUrl && (
              <img src={uploadedUrl} alt="Uploaded Selfie" width={220} />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {!image && !uploadedUrl && (
                <button
                  className="button button-border button-border-primary button-small"
                  onClick={capture}
                >
                  Capture Selfie
                </button>
              )}
              {image && !uploadedUrl && (
                <>
                  <button
                    className="button button-border button-border-primary button-small"
                    onClick={uploadToFirebase}
                  >
                    Upload Selfie
                  </button>
                  <button
                    className="button button-border button-border-gray button-small"
                    onClick={() => setImage(null)}
                  >
                    Retake
                  </button>
                </>
              )}
            </div>
          </div>
          <button
            className="button button-border button-border-primary button-small"
            style={{ marginLeft: 8 }}
            onClick={onNext}
            disabled={!uploadedUrl}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.45)" }}>
        NOTE:{" "}
        <ul>
          <li>
            Picture should not be blurred, neither too dark nor too bright.
          </li>
          <li>
            It should be live picture, not a screenshot or a photo of a photo.
          </li>
          <li>Your whole face should be clealy visible.</li>
          <li>
            System will delete KYC-related documents after order completion.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelfieCapture;
