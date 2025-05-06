import React, { useMemo, useState, useEffect } from "react";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import firebase from "@/services/firebase";

const IdentificationProofUpload = ({ onNext, onPrev, orderId }) => {
  const [fileList, setFileList] = useState([]);
  const [uploadedFileList, setUploadedFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [downloadURLs, setDownloadURLs] = useState([]);

  const handleUpload = async () => {
    if (!fileList.length) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);

    try {
      const urls = await firebase.uploadFiles(
        fileList,
        `orders/${orderId}/identification`,
        "identification"
      );
      setDownloadURLs(urls);

      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploadedFileList([...fileList]);
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file, fList) => {
      const newList = [...fileList, ...fList];
      const last2NewList = newList.slice(Math.max(newList.length - 2, 0));
      setFileList(last2NewList);
      return false;
    },
    fileList,
    multiple: true,
  };

  const uploadEnabled = useMemo(() => {
    if (fileList.length === 0) {
      return false;
    }
    return !fileList.every((file) => {
      const uploadedFile = uploadedFileList.find(
        (uploadedFile) => uploadedFile.name === file.name
      );
      if (uploadedFile) {
        return true;
      }
      return false;
    });
  }, [fileList, uploadedFileList]);

  useEffect(() => {
    uploadedFileList.forEach((file) => {
      const element = document.querySelector(`[title="${file.name}"]`);
      if (element) {
        element.style.color = "#0d9488";
      }
    });
  }, [uploadedFileList]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h6>Upload Identification Proof</h6>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select Identity Proof</Button>
            </Upload>
            <button
              className="button button-border button-border-primary button-small"
              style={{ height: "32px" }}
              onClick={handleUpload}
              disabled={uploading || !uploadEnabled}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        <div
          style={{ display: "flex", gap: 10, justifyContent: "space-around" }}
        >
          <button
            className="button button-border button-border-primary button-small"
            onClick={onPrev}
            type="button"
          >
            Previous
          </button>

          <button
            className="button button-border button-border-primary button-small"
            style={{ marginLeft: 8 }}
            onClick={onNext}
            disabled={downloadURLs.length === 0}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
      <div style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.45)" }}>
        NOTE:{" "}
        <ul>
          <li>Only aadhar and driving license are accepted.</li>
          <li>Document should be clear and complete.</li>
          <li>
            Please upload full document (Example: Both sides of aadhar card).
          </li>
          <li>
            System will delete KYC-related documents after order completion.
          </li>
          <li>You can upload multiple files. (Max 2 files, 5MB each).</li>
        </ul>
      </div>
    </div>
  );
};

export default IdentificationProofUpload;
