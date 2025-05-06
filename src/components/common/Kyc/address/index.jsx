import React, { useMemo, useState, useEffect } from "react";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import firebase from "@/services/firebase";

const AddressProofUpload = ({ onSubmit, orderId }) => {
  const [fileList, setFileList] = useState([]);
  const [uploadedFileList, setUploadedFileList] = useState([]);
  const [addressMatch, setAddressMatch] = useState(false);
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
        `orders/${orderId}/address`,
        "address"
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
        }}
      >
        <span>Does the address in your ID match with delivery address?</span>
        <div style={{ display: "flex", gap: "30px" }}>
          <input
            id="addressMatchYes"
            checked={addressMatch === true}
            type="radio"
            name="addressMatch"
            value="yes"
            onChange={(e) => {
              if (e.target.checked) {
                setAddressMatch(true);
              }
            }}
            style={{ marginRight: "5px" }}
          />
          <label htmlFor="addressMatchYes">Yes</label>

          <input
            id="addressMatchNo"
            checked={addressMatch !== true}
            type="radio"
            name="addressMatch"
            value="no"
            onChange={(e) => {
              if (e.target.checked) {
                setAddressMatch(false);
              }
            }}
            style={{ marginRight: "5px" }}
          />
          <label htmlFor="addressMatchNo">No</label>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {!addressMatch && <h6>Upload Address Proof</h6>}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {!addressMatch && (
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Select Address Proof</Button>
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
          )}

          <button
            className="button button-border button-border-primary button-small"
            style={{ marginLeft: 8 }}
            onClick={onSubmit}
            disabled={!addressMatch && downloadURLs.length === 0}
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
      {!addressMatch && (
        <div style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.45)" }}>
          NOTE:{" "}
          <ul>
            <li>
              It could be anything electricity, internet, gas bill or rental
              agreement etc.
            </li>
            <li>
              Name on the bill need not to match your name (Example: You can
              provide your electricity bill on your landlord's name)
            </li>
            <li>It should be a recent bill (not older than 3 months).</li>
            <li>
              System will delete KYC-related documents after order completion.
            </li>
            <li>You can upload multiple files. (Max 2 files, 5MB each).</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressProofUpload;
