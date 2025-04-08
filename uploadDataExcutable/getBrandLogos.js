const { MongoClient } = require("mongodb");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const os = require("os");

const DB_URI =
  "mongodb+srv://ronen_mong_user:0mj2Dg47uWydsmyq@ronen.bswne.mongodb.net/finalproject";
const STOCK_COLLECTION = "stocks";
// const LOGOS_COLLECTION = "logos";
const LOGOS_DIR = path.join(
  __dirname,
  "..",
  "WebShopServer",
  "public",
  "logos"
);
const NUM_THREADS = Math.min(os.cpus().length, 8); // Use up to 8 threads or available CPU cores

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to get favicon URL
const getFaviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Helper function to delete all files in directory
async function deleteDirectory(directory) {
  try {
    await fs.rm(directory, { force: true, recursive: true });
    console.log("✨ Cleaned up old logo files");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(
        "Note: No existing logos folder found - will create a new one"
      );
    } else {
      throw err;
    }
  }
}

// Worker function to process a single brand
async function processBrand(brand, index, total) {
  try {
    if (!brand)
      return {
        success: false,
        brand,
        message: "Empty brand name found in data",
      };

    console.log(`\n🔍 Searching for logo: ${brand} (${index + 1} of ${total})`);

    // Clean brand name and create domain
    const cleanBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
    const domains = [
      `${cleanBrand}.com`,
      `www.${cleanBrand}.com`,
      `${cleanBrand}.net`,
      `${cleanBrand}.org`,
    ];

    for (const domain of domains) {
      try {
        const logoUrl = getFaviconUrl(domain);
        const response = await axios.head(logoUrl);

        if (response.status === 200) {
          console.log(`✅ Found logo for ${brand}`);
          const response = await axios.get(logoUrl, {
            responseType: "arraybuffer",
          });
          const fileName = `${brand.replace(/[^a-zA-Z0-9]/g, "_")}_logo.png`;
          const filePath = path.join(LOGOS_DIR, fileName);
          await fs.writeFile(filePath, response.data);

          return {
            success: true,
            brand,
            fileName,
            filePath: `/logos/${fileName}`,
            message: `Successfully saved logo as: ${fileName}`,
          };
        }
      } catch (error) {
        continue;
      }
    }

    return {
      success: false,
      brand,
      message: `Could not find a logo for ${brand}`,
    };
  } catch (error) {
    return {
      success: false,
      brand,
      message: `Error while searching for ${brand}'s logo: ${error.message}`,
    };
  }
}

// Main function to coordinate workers
async function getBrandLogos() {
  let client;
  let stats = {
    total: 0,
    successful: 0,
    failed: 0,
  };

  try {
    // Delete existing logos directory
    await deleteDirectory(LOGOS_DIR);

    // Create new logos directory
    try {
      await fs.mkdir(LOGOS_DIR, { recursive: true });
      console.log("📁 Created new logos folder");
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    // Connect to MongoDB
    client = await MongoClient.connect(DB_URI);
    console.log("✅ Connected to database successfully");

    const db = client.db("finalproject");
    const stockCollection = db.collection(STOCK_COLLECTION);
    // const logosCollection = db.collection(LOGOS_COLLECTION);

    // Drop the logos collection before starting
    try {
      // await logosCollection.drop();
      console.log("Logos collection dropped successfully");
    } catch (err) {
      if (err.code === 26) {
        console.log("Logos collection does not exist, will create new one");
      } else {
        throw err;
      }
    }

    // Get unique brands
    const brands = await stockCollection.distinct("Brand");
    stats.total = brands.length;
    console.log(`\n📊 Found ${stats.total} unique brands in the data`);
    console.log(
      `ℹ️ Using ${NUM_THREADS} parallel processes to speed up logo search`
    );

    // Process brands in chunks
    const chunkSize = Math.ceil(brands.length / NUM_THREADS);
    const chunks = [];
    for (let i = 0; i < brands.length; i += chunkSize) {
      chunks.push(brands.slice(i, i + chunkSize));
    }

    const workers = [];
    const results = [];

    // Create and start workers
    for (let i = 0; i < chunks.length; i++) {
      const worker = new Worker(__filename, {
        workerData: {
          brands: chunks[i],
          startIndex: i * chunkSize,
          total: brands.length,
        },
      });

      worker.on("message", (result) => {
        results.push(result);
        if (result.success) {
          stats.successful++;
        } else {
          stats.failed++;
        }
      });

      worker.on("error", (err) => {
        console.error(`❌ Process error: ${err.message}`);
        stats.failed++;
      });

      workers.push(worker);
    }

    // Wait for all workers to complete
    await Promise.all(
      workers.map(
        (worker) => new Promise((resolve) => worker.on("exit", resolve))
      )
    );

    // Store results in MongoDB
    // for (const result of results) {
    //   if (result.success) {
    //     await logosCollection.insertOne({
    //       brand: result.brand,
    //       logoPath: result.filePath,
    //       fileName: result.fileName,
    //       createdAt: new Date(),
    //     });
    //   }
    // }

    // Print summary
    console.log("\n📊 Logo Download Summary:");
    console.log("----------------------");
    results.forEach((result) => {
      if (result.success) {
        console.log(`✅ ${result.brand}: ${result.message}`);
      } else {
        console.log(`❌ ${result.brand}: ${result.message}`);
      }
    });

    // Print statistics
    console.log("\n📈 Final Statistics:");
    console.log("-----------------");
    console.log(`📦 Total brands processed: ${stats.total}`);
    console.log(`✅ Successfully found logos: ${stats.successful}`);
    console.log(`❌ Could not find logos: ${stats.failed}`);
    console.log(
      `📊 Success rate: ${((stats.successful / stats.total) * 100).toFixed(2)}%`
    );
  } catch (err) {
    console.error("\n⚠️ ERROR:", err.message);
    if (err.name === "MongoServerError") {
      console.error(
        "\nCould not connect to the database.\nPlease check your internet connection and try again."
      );
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("\n✅ Database connection closed");
    }
  }
}

// Worker thread code
if (!isMainThread) {
  const { brands, startIndex, total } = workerData;
  brands.forEach(async (brand, index) => {
    const result = await processBrand(brand, startIndex + index, total);
    parentPort.postMessage(result);
  });
}

// Main thread code
if (isMainThread) {
  if (require.main === module) {
    getBrandLogos().catch(console.error);
  }
}

module.exports = { getBrandLogos };
