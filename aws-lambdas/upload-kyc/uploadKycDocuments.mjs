import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import https from "https";

const s3Client = new S3Client({});

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { orderId, selfieUrl, idProofUrl1, idProofUrl2, addressProofUrl } =
      body;

    if (!orderId || !selfieUrl || (!idProofUrl1 && !idProofUrl2)) {
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
          error:
            "Missing required fields: orderId, selfieUrl, idProofUrl1/idProofUrl2",
        }),
      };
    }

    const bucketName = process.env.KYC_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("KYC_BUCKET_NAME environment variable not set");
    }

    const folderPrefix = `${orderId}/`;

    // Split comma/space separated URLs and trim whitespace
    const splitUrls = (str) =>
      (str || "")
        .split(/[,\s]+/)
        .map((u) => u.trim())
        .filter(Boolean);

    const selfieUrls = splitUrls(selfieUrl);
    const idUrls = splitUrls(idProofUrl1 || "").concat(
      splitUrls(idProofUrl2 || "")
    );
    const addressUrls = splitUrls(addressProofUrl);

    console.log(
      `Processing ${selfieUrls.length} selfie(s), ${idUrls.length} ID(s), ${addressUrls.length} address proof(s)`
    );

    // Track successful uploads
    const results = {
      selfie: [],
      id_proof: [],
      address_proof: [],
    };

    // Process sequentially to avoid concurrency issues
    const allUrls = [
      ...selfieUrls.map((url, i) => ({
        url,
        type: "selfie",
        filename: `selfie_${Date.now()}_${i}.jpg`,
      })),
      ...idUrls.map((url, i) => ({
        url,
        type: "id_proof",
        filename: `id_proof_${Date.now()}_${i}.jpg`,
      })),
      ...addressUrls.map((url, i) => ({
        url,
        type: "address_proof",
        filename: `address_proof_${Date.now()}_${i}.jpg`,
      })),
    ];

    for (const { url, type, filename } of allUrls) {
      try {
        console.log(`Processing ${type}: ${url}`);
        const s3Key = `${folderPrefix}${filename}`;
        await downloadAndUpload(url, bucketName, s3Key, url);
        results[type].push(filename);
        console.log(`✅ Uploaded ${type}: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed ${type} (${url}):`, error.message);
        // Continue with other files
      }
    }

    const totalUploaded =
      results.selfie.length +
      results.id_proof.length +
      results.address_proof.length;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        success: true,
        message: `Uploaded ${totalUploaded} document(s) successfully`,
        orderId,
        s3Path: `s3://${bucketName}/${folderPrefix}`,
        details: results,
        summary: {
          selfie: results.selfie.length,
          id_proof: results.id_proof.length,
          address_proof: results.address_proof.length,
        },
      }),
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        error: "Failed to process KYC documents",
        details: error.message,
      }),
    };
  }
};

async function downloadAndUpload(sourceUrl, bucket, key, originalUrl) {
  let currentUrl = sourceUrl;
  const maxRedirects = 5;

  // Handle redirects iteratively (no recursion)
  for (let redirectCount = 0; redirectCount < maxRedirects; redirectCount++) {
    try {
      const result = await downloadFromUrl(currentUrl, redirectCount);
      if (result.buffer) {
        await uploadToS3(result.buffer, bucket, key, originalUrl);
        return;
      }
      if (result.redirectUrl) {
        // ✅ REDIRECT - Update URL and continue
        currentUrl = result.redirectUrl;
        console.log(`Following redirect ${redirectCount + 1}: ${currentUrl}`);
        continue;
      }
      throw new Error("Download failed - no buffer or redirect URL");
    } catch (error) {
      if (redirectCount === maxRedirects - 1) {
        throw new Error(
          `Max redirects (${maxRedirects}) exceeded or download failed: ${error.message}`
        );
      }
    }
  }
}

function downloadFromUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        timeout: 60000, // 60 seconds timeout
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EzysKycBot/1.0)",
        },
      },
      (res) => {
        console.log(`HTTP ${res.statusCode} for ${url}`);

        // Handle redirects (300-399)
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          console.log(`Redirect ${redirectCount + 1}: ${res.headers.location}`);
          resolve({
            buffer: null,
            redirectUrl: res.headers.location,
          });
          res.destroy(); // Close response stream
          return;
        }

        // Handle non-200 status
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          res.destroy();
          return;
        }

        // Collect response body
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          console.log(`Downloaded ${buffer.length} bytes`);
          resolve({
            buffer,
            redirectUrl: null,
          }); // ✅ RETURN buffer as OBJECT
        });
        res.on("error", reject);
      }
    );

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error("Download timeout (60s)"));
    });

    req.on("error", reject);
  });
}

async function uploadToS3(bodyBuffer, bucket, key, sourceUrl) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: bodyBuffer,
    ContentType: "image/jpeg",
    Metadata: {
      orderId: key.split("/")[0],
      uploadedAt: new Date().toISOString(),
      sourceUrl: sourceUrl,
      size: bodyBuffer.length.toString(),
    },
  });

  const result = await s3Client.send(command);
  console.log(`✅ S3 Upload successful: ${key} (${bodyBuffer.length} bytes)`);
}
