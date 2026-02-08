const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const zlib = require("zlib");

const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = process.env.BUCKET_NAME;
const KEY = "psn-games-latest.json.gz";

const ENDPOINTS = [
  "https://www.playstation.com/bin/imagic/gameslist?locale=en-in&categoryList=plus-games-list",
  "https://www.playstation.com/bin/imagic/gameslist?locale=en-in&categoryList=plus-classics-list",
  "https://www.playstation.com/bin/imagic/gameslist?locale=en-in&categoryList=plus-monthly-games-list",
];

// 🔥 ULTIMATE NICKNAME GENERATOR (runs once during build)
function generateAllNicknames(title) {
  const cleanTitle = title
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]|\)|\]|\™|®/g, "") // Remove PS4™ PS5™
    .replace(/[^\w\s]/g, " ") // Clean punctuation
    .trim();

  const words = cleanTitle.split(/\s+/).filter((w) => w.length > 1);
  const nicknames = new Set([cleanTitle]); // Original first

  // 1. ABBREVIATIONS (Grand Theft Auto V → gta, gtav)
  if (words.length >= 2) {
    nicknames.add(words.map((w) => w[0]).join("")); // GTA
    nicknames.add(
      words
        .slice(0, -1)
        .map((w) => w[0])
        .join("") + words.slice(-1)[0],
    ); // GTAV
  }

  // 2. FIRST WORDS (Grand Theft, Call of Duty)
  if (words.length >= 2) {
    nicknames.add(words.slice(0, 2).join(" "));
    if (words.length >= 3) nicknames.add(words.slice(0, 3).join(" "));
  }

  // 3. SERIES SHORTCUTS (FF, AC, CoD, RE)
  const series = {
    "final fantasy": ["ff"],
    "assassin creed": ["ac", "assassins creed"],
    "call of duty": ["cod"],
    "grand theft auto": ["gta"],
    "resident evil": ["re"],
    "the last of us": ["tlou"],
    "god of war": ["gow"],
  };

  for (const [pattern, shorts] of Object.entries(series)) {
    if (cleanTitle.includes(pattern)) {
      shorts.forEach((short) => nicknames.add(short));
    }
  }

  // 4. NUMBER PATTERNS (FIFA24, MW2, AC6)
  const numMatch = cleanTitle.match(/(\d+)/);
  if (numMatch && words.length >= 1) {
    nicknames.add(`${words[0]}${numMatch[1]}`);
  }

  return Array.from(nicknames).slice(0, 10); // Limit to top 10
}

exports.handler = async () => {
  try {
    const allGames = [];

    for (const url of ENDPOINTS) {
      console.log(`Fetching ${url}`);
      const response = await fetch(url);
      const data = await response.json();

      data.forEach((catalog) => {
        catalog.games.forEach((game) => {
          const allNicknames = generateAllNicknames(game.name);

          allGames.push({
            conceptId: game.conceptId,
            name: game.name.toLowerCase(),
            nameOriginal: game.name,
            devices: game.device,
            productId: game.productId,
            storeUrl: game.conceptUrl,
            imageUrl: game.imageUrl,
            genre: (game.genre || []).join(","),
            // 🔥 ALL NICKNAMES PRE-GENERATED
            allNicknames: allNicknames,
            nicknameCount: allNicknames.length,
            primaryNickname: allNicknames[0],
          });
        });
      });
    }

    const gamesData = {
      games: allGames,
      updatedAt: new Date().toISOString(),
      count: allGames.length,
      nicknameStats: {
        totalNicknames: allGames.reduce(
          (sum, g) => sum + g.allNicknames.length,
          0,
        ),
        avgNicknamesPerGame: allGames.length
          ? Math.round(
              allGames.reduce((sum, g) => sum + g.allNicknames.length, 0) /
                allGames.length,
            )
          : 0,
      },
    };

    const jsonString = JSON.stringify(gamesData, null, 2);
    const compressed = zlib.gzipSync(jsonString);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: KEY,
        Body: compressed,
        ContentEncoding: "gzip",
        ContentType: "application/json",
        Metadata: {
          totalGames: allGames.length.toString(),
          totalNicknames: gamesData.nicknameStats.totalNicknames.toString(),
        },
      }),
    );

    console.log(
      `✅ Saved ${allGames.length} games with ${gamesData.nicknameStats.totalNicknames} total nicknames`,
    );
    console.log(
      `📊 Avg ${gamesData.nicknameStats.avgNicknamesPerGame} nicknames per game`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
        stats: gamesData.nicknameStats,
        sampleGame: allGames[0],
      }),
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return { statusCode: 500, body: error.message };
  }
};
