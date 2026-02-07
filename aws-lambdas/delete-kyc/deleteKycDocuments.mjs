import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { orderId } = body;

    if (!orderId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({
          success: false,
          error: "orderId is required",
        }),
      };
    }

    const bucketName = process.env.KYC_BUCKET_NAME;
    const folderPrefix = `${orderId}/`;

    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix,
    });

    const { Contents } = await s3Client.send(listCommand);

    if (!Contents?.length) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          message: "No KYC documents found for this order",
        }),
      };
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: Contents.map((obj) => ({ Key: obj.Key })),
      },
    });

    await s3Client.send(deleteCommand);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "KYC documents deleted successfully",
        orderId,
        deletedCount: Contents.length,
      }),
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        error: "Failed to delete KYC documents",
        details: error.message,
      }),
    };
  }
};
