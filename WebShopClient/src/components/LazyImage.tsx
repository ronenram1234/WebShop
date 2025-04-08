import { FunctionComponent, useState, useEffect } from "react";

interface LazyImageProps {
  fileName: string;
  brand: string;
  getImageUrl: (fileName: string) => Promise<string>;
  style?: React.CSSProperties;
  className?: string;
}

const LazyImage: FunctionComponent<LazyImageProps> = ({
  fileName,
  brand,
  getImageUrl,
  style,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Load image on component mount or when fileName changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getImageUrl(fileName)
      .then((url) => {
        if (isMounted) {
          setImageUrl(url);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error(`Error loading image for ${brand}:`, error);
          setImageUrl("/placeholder.png");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [fileName, brand, getImageUrl]);

  if (isLoading) {
    return (
      <div className="lazy-image-loading" style={style}>
        Loading...
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={brand}
      style={style}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = "/placeholder.png";
      }}
    />
  );
};

export default LazyImage;
