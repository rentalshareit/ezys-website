import React, { useEffect, useState, useRef } from "react";
import { Input, Spin, Empty, Tag, Row, Col, Button, Space, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { Boundary, MessageDisplay } from "@/components/common";
import psn_deluxe from "@/images/psn_deluxe.png";
import "./psn_games_catalog.scss";

const ITEMS_PER_PAGE = 12;

const PSNGamesCatalog = ({ location }) => {
  useDocumentTitle("Ezys | Game Catalog");
  useScrollTop();

  const [games, setGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState("");
  const searchTimeoutRef = useRef(null);

  // Get banner text from query param
  const bannerText = new URLSearchParams(location.search).get("banner") || "";

  // Fetch all games on component mount
  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch("/api/psn-list");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        // Handle response structure: {games: [], count: 562}
        const gamesList = data.games || (Array.isArray(data) ? data : []);
        setGames(gamesList);
      } catch (err) {
        setError("Failed to load games. Please try again later.");
        console.error("Error fetching games:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  // Handle search - triggered on button click
  const handleSearchClick = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      const response = await fetch("/api/psn-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      // Handle response structure: {games: [], count: N}
      const searchResults = data.games || (Array.isArray(data) ? data : []);
      setSearchResults(searchResults);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Error searching games:", err);
      setSearchResults([]);
      setError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Get current games to display
  const displayGames = showSearchResults ? searchResults : games;
  const totalItems = displayGames.length;

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  return (
    <Boundary>
      <main className="content" style={{ flexDirection: "column" }}>
        {/* Banner Section */}
        <div className="featured">
          <div className="banner">
            <div className="banner-desc">
              <h2>PlayStation Games</h2>
              <p>Explore our premium collection of PlayStation games</p>
            </div>
            <div className="banner-img">
              <img src={psn_deluxe} alt="PlayStation Games Banner" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="game-catalog-wrapper">
          {/* Error Message */}
          {error && !isLoading && (
            <MessageDisplay message="Error" desc={error} />
          )}

          {/* Loading State */}
          {(isLoading || isSearching) && (
            <div className="loader">
              <div className="ezys-spinner">
                <Spin size="large" />
              </div>
            </div>
          )}

          {/* Games Grid */}
          {!isLoading && !isSearching && !error && (
            <div className="game-catalog-content">
              <div className="game-catalog-top-bar">
                <div className="pagination-left">
                  <div className="pagination-wrapper">
                    Total Games: {totalItems}
                  </div>
                </div>
                <div className="search-right">
                  <Input.Search
                    className="game-search-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 2 }}
                    onKeyUp={handleSearchKeyPress}
                    onSearch={handleSearchClick}
                    placeholder="Search Game..."
                    readOnly={isLoading}
                    value={searchQuery}
                    allowClear
                    onClear={handleClearSearch}
                  />
                  <div className="search-results-count"></div>
                </div>
              </div>

              {/* Games Grid */}
              <section className="game-catalog-section">
                {displayGames.length > 0 ? (
                  <Row gutter={[16, 24]} className="games-grid">
                    {displayGames.map((game) => (
                      <Col
                        xs={12}
                        sm={8}
                        md={6}
                        lg={4}
                        key={game.productId || game.name}
                      >
                        <GameCard game={game} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty
                    description={
                      showSearchResults
                        ? "No games found. Try different keywords."
                        : "No games available"
                    }
                  />
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </Boundary>
  );
};

// Game Card Component
const GameCard = ({ game }) => {
  // Parse genres from comma-separated string
  const genres =
    typeof game.genre === "string"
      ? game.genre
          .split(",")
          .map((g) => g.trim())
          .slice(0, 1)
      : Array.isArray(game.genre)
        ? game.genre.slice(0, 1)
        : [];

  const devices = Array.isArray(game.devices) ? game.devices : [];
  // Show only PS4 and PS5
  const displayDevices = devices.filter((d) => ["PS4", "PS5"].includes(d));

  return (
    <Card
      hoverable
      className="game-card"
      cover={
        <div className="game-card-image-wrapper">
          <img
            src={game.imageUrl}
            alt={game.name}
            className="game-card-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x400?text=Game+Image";
            }}
          />
        </div>
      }
      bodyStyle={{ padding: "1.2rem" }}
    >
      <h3 className="game-card-title" title={game.name}>
        {game.name}
      </h3>

      {/* Genres */}
      {genres.length > 0 && (
        <div className="game-card-genres">
          <Space size={4}>
            {genres.map((genre) => (
              <Tag key={genre}>{genre}</Tag>
            ))}
          </Space>
        </div>
      )}

      {/* Devices - PS4, PS5 only */}
      {displayDevices.length > 0 && (
        <div className="game-card-devices">
          <Space size={4}>
            {displayDevices.map((device) => (
              <Tag key={device} className="device-tag">
                {device}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default PSNGamesCatalog;
