import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getAllLogos, getLogoFile } from "../services/getLogos";
import { getAllStocks } from "../services/getStocks";
import { Logo } from "../interfaces/Logo";
import { Stock } from "../interfaces/Stock";
import StoreCarousel from "./StoreCarousel";
import StockTable from "./StockTable";
import { GlobalProps } from "../context/GlobalContext";

interface StoreProductsCardsProps {}

interface LogoCache {
  url: string;
  lastAccessed: number;
}

const spinnerStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "10px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StoreProductsCards: FunctionComponent<StoreProductsCardsProps> = () => {
  const { token } = useContext(GlobalProps);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [descriptionSearchTerm, setDescriptionSearchTerm] = useState("");
  const [skuSearchTerm, setSkuSearchTerm] = useState("");
  const [filteredLogos, setFilteredLogos] = useState<Logo[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedLogos, setLoadedLogos] = useState<Set<string>>(new Set());
  const logoUrlCache = useRef<Record<string, LogoCache>>({});
  const placeholderUrl = "/placeholder.png";

  const getLogoUrl = async (fileName: string): Promise<string> => {
    try {
      // Check memory cache first and update last accessed time
      if (logoUrlCache.current[fileName]) {
        logoUrlCache.current[fileName].lastAccessed = Date.now();
        return logoUrlCache.current[fileName].url;
      }

      const fileResponse = await getLogoFile(fileName);
      const blob = new Blob([fileResponse.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);

      // Store in cache with timestamp
      logoUrlCache.current[fileName] = {
        url,
        lastAccessed: Date.now(),
      };

      // Update loaded logos set
      setLoadedLogos((prev) => new Set([...prev, fileName]));

      return url;
    } catch (error) {
      logoUrlCache.current[fileName] = {
        url: placeholderUrl,
        lastAccessed: Date.now(),
      };
      return placeholderUrl;
    }
  };

  // Cleanup old cached logos periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes

      Object.entries(logoUrlCache.current).forEach(([fileName, cache]) => {
        if (now - cache.lastAccessed > maxAge && cache.url !== placeholderUrl) {
          URL.revokeObjectURL(cache.url);
          delete logoUrlCache.current[fileName];
          setLoadedLogos((prev) => {
            const newSet = new Set(prev);
            newSet.delete(fileName);
            return newSet;
          });
        }
      });
    }, 60000); // Check every minute

    return () => {
      clearInterval(cleanupInterval);
      // Cleanup all cached URLs on unmount
      Object.values(logoUrlCache.current).forEach((cache) => {
        if (cache.url !== placeholderUrl) {
          URL.revokeObjectURL(cache.url);
        }
      });
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [logosResponse, stocksResponse] = await Promise.all([
          getAllLogos(),
          getAllStocks(token),
        ]);

        if (!logosResponse.data || !Array.isArray(logosResponse.data)) {
          throw new Error("Invalid logos response format from API");
        }

        // Pre-fetch and cache all logo statuses
        if (logosResponse.data.length > 0) {
          await Promise.all(
            logosResponse.data.map(async (logo) => {
              try {
                await getLogoUrl(logo.fileName);
              } catch {
                // Silently handle pre-fetch errors
              }
            })
          );
        }

        if (!stocksResponse.data || !Array.isArray(stocksResponse.data)) {
          throw new Error("Invalid stocks response format from API");
        }

        setLogos(logosResponse.data);
        setFilteredLogos(logosResponse.data);
        setStocks(stocksResponse.data);
        setFilteredStocks(stocksResponse.data);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        setLogos([]);
        setFilteredLogos([]);
        setStocks([]);
        setFilteredStocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const brandSearchLower = brandSearchTerm.toLowerCase();
    const descSearchLower = descriptionSearchTerm.toLowerCase();
    const skuSearchLower = skuSearchTerm.toLowerCase();

    const filteredStocksData = stocks.filter((stock) => {
      const brandLower = (stock.Brand || "").toLowerCase();
      const descriptionLower = (stock.Description || "").toLowerCase();
      const skuLower = (stock.SKU || "").toLowerCase();

      const matchesBrand =
        brandSearchTerm === "" || brandLower.includes(brandSearchLower);
      const matchesDescription =
        descriptionSearchTerm === "" ||
        descriptionLower.includes(descSearchLower);
      const matchesSku =
        skuSearchTerm === "" || skuLower.includes(`sku-${skuSearchLower}`);

      return matchesBrand && matchesDescription && matchesSku;
    });

    const brandsWithMatchingCriteria = new Set(
      filteredStocksData.map((stock) => stock.Brand.toLowerCase())
    );

    const filtered = logos.filter((logo) => {
      const brandLower = logo.brand.toLowerCase();
      const matchesBrandSearch =
        brandSearchTerm === "" || brandLower.includes(brandSearchLower);
      const hasMatchingProducts =
        (descriptionSearchTerm === "" && skuSearchTerm === "") ||
        brandsWithMatchingCriteria.has(brandLower);

      return matchesBrandSearch && hasMatchingProducts;
    });

    setFilteredLogos(filtered);
    setFilteredStocks(filteredStocksData);
  }, [brandSearchTerm, descriptionSearchTerm, skuSearchTerm, logos, stocks]);

  useEffect(() => {
    // Add keyframes to document
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerKeyframes;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleBrandSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setBrandSearchTerm(value);
    }
  };

  const handleDescriptionSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setDescriptionSearchTerm(value);
    }
  };

  const handleSkuSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove any "SKU-" prefix from the input value if user tries to type it
    const cleanValue = value.replace(/^SKU-/, "");
    if (cleanValue.length <= 10) {
      // Reduced max length to account for "SKU-" prefix
      setSkuSearchTerm(cleanValue);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="store-search-container">
      <div className="search-forms-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by brand..."
            value={brandSearchTerm}
            onChange={handleBrandSearchChange}
            maxLength={10}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search Brand
          </button>
        </form>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by description..."
            value={descriptionSearchTerm}
            onChange={handleDescriptionSearchChange}
            maxLength={20}
            className="search-input description"
          />
          <button type="submit" className="search-button">
            Search Description
          </button>
        </form>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="sku-input-container">
            <span className="sku-prefix">SKU-</span>
            <input
              type="text"
              placeholder="Enter SKU..."
              value={skuSearchTerm}
              onChange={handleSkuSearchChange}
              maxLength={10}
              className="sku-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search SKU
          </button>
        </form>
      </div>
      <div
        className="store-products-container"
        style={{
          border: "2px solid black",
          borderRadius: "8px",
          padding: "10px",
          margin: "10px 20px",
          minHeight: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <div style={spinnerStyles.container}>
            <div style={spinnerStyles.spinner} />
          </div>
        ) : logos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No logos available
          </div>
        ) : (
          <StoreCarousel logos={filteredLogos} getLogoUrl={getLogoUrl} />
        )}
      </div>
      <StockTable stocks={filteredStocks} />
    </div>
  );
};

export default StoreProductsCards;
