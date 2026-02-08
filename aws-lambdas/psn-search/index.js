const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const zlib = require("zlib");
const Fuse = require("fuse.js");

const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET_NAME;
const KEY = "psn-games-latest.json.gz";

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return corsResponse(200);
  if (event.httpMethod !== "POST") return methodNotAllowed();

  try {
    // Parse POST: { "query": "GTA5", "limit": 20 }
    const body = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString("utf-8")
        : event.body,
    );
    const { query = "", limit = 20 } = body;
    const searchQuery = query.trim();
    const pageLimit = parseInt(limit) || 20;

    // Load pre-built data (with allNicknames!)
    const { Body } = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: KEY }),
    );
    const chunks = [];
    for await (const chunk of Body) chunks.push(chunk);
    const rawBuffer = Buffer.concat(chunks);
    const rawData = zlib.gunzipSync(rawBuffer);
    const gamesData = JSON.parse(rawData.toString("utf-8"));
    const gamesArray = Array.isArray(gamesData.games) ? gamesData.games : [];

    console.log(`✅ Loaded ${gamesArray.length} games`);

    // 🔥 SUPER SIMPLE - Uses pre-generated nicknames!
    const fuse = new Fuse(gamesArray, {
      keys: [
        "allNicknames", // ← Magic happens here!
        "name",
        "nameOriginal",
        "primaryNickname",
        "genre",
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
      isCaseSensitive: false,
    });

    let responseData;

    if (searchQuery) {
      // Search works for ANY nickname/abbreviation!
      const results = fuse.search(searchQuery).slice(0, pageLimit);

      responseData = {
        success: true,
        games: results.map((r) => ({
          conceptId: r.item.conceptId,
          name: r.item.name,
          nameOriginal: r.item.nameOriginal,
          devices: r.item.devices,
          productId: r.item.productId,
          storeUrl: r.item.storeUrl,
          imageUrl: r.item.imageUrl,
          searchScore: Math.round((1 - r.score) * 100) / 100, // 1.0 = perfect
          matchedNicknames: r.item.allNicknames.slice(0, 3), // Show what matched
          allNicknamesCount: r.item.allNicknames?.length || 0,
        })),
        total: results.length,
        query: searchQuery,
        took: Date.now(),
      };
    } else {
      // Pagination (no query)
      responseData = {
        success: true,
        games: gamesArray.slice(0, pageLimit).map((g) => ({
          conceptId: g.conceptId,
          name: g.name,
          nameOriginal: g.nameOriginal,
          devices: g.devices,
          productId: g.productId,
          storeUrl: g.storeUrl,
          imageUrl: g.imageUrl,
          nicknameCount: g.allNicknames?.length || 0,
        })),
        total: gamesArray.length,
        took: Date.now(),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(responseData, null, 2),
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: false,
        error: "Server error",
        details: error.message,
      }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Content-Type": "application/json",
  };
}

function corsResponse(statusCode) {
  return { statusCode, headers: corsHeaders(), body: "" };
}

function methodNotAllowed() {
  return {
    statusCode: 405,
    headers: corsHeaders(),
    body: JSON.stringify({ success: false, error: "POST only" }),
  };
}
