/**
 * Upload Stock Data to MongoDB
 *
 * This script reads data from the "Sheet1" tab in Inventory.xlsx and uploads it to MongoDB.
 * You can specify how many records to upload using command line arguments.
 *
 * Usage:
 *   node uploadStock.js [limit]
 *
 * Examples:
 *   node uploadStock.js           # Upload all records
 *   node uploadStock.js full      # Upload all records
 *   node uploadStock.js 1000      # Upload first 1000 records
 *   node uploadStock.js 500       # Upload first 500 records
 *
 * Note: The script will clear existing data in the collection before uploading new data.
 */

const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");
const stockSchema = require("./stockSchema");
const { getBrandLogos } = require("./getBrandLogos");

const DB_URI =
  "mongodb+srv://ronen_mong_user:0mj2Dg47uWydsmyq@ronen.bswne.mongodb.net/finalproject";
const COLLECTION_NAME = "stocks";
const BATCH_SIZE = 100; // Process 100 records at a time

async function uploadToMongo(limit) {
  let client;
  try {
    // Connect to MongoDB first to drop the collection
    client = await MongoClient.connect(DB_URI);
    console.log("Connected to MongoDB successfully");

    const db = client.db("finalproject");
    const collection = db.collection(COLLECTION_NAME);

    // Drop the collection
    await collection.drop().catch((err) => {
      if (err.code === 26) {
        console.log("Collection does not exist, will create new one");
      } else {
        throw err;
      }
    });
    console.log("Collection dropped successfully");

    // Read the Excel file
    console.log("Reading Excel file 'Inventory.xlsx'...");
    const workbook = XLSX.readFile("Inventory.xlsx");
    console.log(
      "Available sheets in the Excel file:",
      Object.keys(workbook.Sheets)
    );
    const worksheet = workbook.Sheets["Stock"];
    if (!worksheet) {
      console.error(
        "\n⚠️ ERROR: Could not find the 'Stock' sheet in your Excel file.\nPlease make sure:\n1. Your Excel file is named 'Inventory.xlsx'\n2. It contains a sheet named 'Stock'\n3. The file is in the same folder as this script"
      );
      process.exit(1);
    }
    let data = XLSX.utils.sheet_to_json(worksheet);

    // Apply limit if specified
    if (limit !== "full") {
      const numLimit = parseInt(limit);
      if (!isNaN(numLimit) && numLimit > 0) {
        data = data.slice(0, numLimit);
        console.log(
          `Processing the first ${numLimit} items from the Excel file`
        );
      } else {
        console.error(
          "\n⚠️ ERROR: The number of items to process is not valid.\nPlease use:\n- 'full' to process all items\n- A positive number (like 100) to process that many items"
        );
        process.exit(1);
      }
    } else {
      console.log("Processing all items from the Excel file");
    }

    console.log(`Total items to process: ${data.length}`);

    // Process in batches
    let successCount = 0;
    let errorCount = 0;
    let errorDetails = [];

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      const validRecords = [];

      for (const record of batch) {
        try {
          // Validate the record against schema
          const { error, value } = stockSchema.validate(record, {
            abortEarly: false,
          });

          if (error) {
            const itemNumber = i + batch.indexOf(record) + 1;
            errorDetails.push({
              item: itemNumber,
              errors: error.details.map((d) => d.message),
            });
            errorCount++;
            continue;
          }

          validRecords.push(value);
          successCount++;
        } catch (err) {
          const itemNumber = i + batch.indexOf(record) + 1;
          errorDetails.push({
            item: itemNumber,
            errors: [`Unexpected error: ${err.message}`],
          });
          errorCount++;
        }
      }

      // Insert batch of valid records
      if (validRecords.length > 0) {
        await collection.insertMany(validRecords);
      }

      // Log progress
      console.log(`Processed ${i + batch.length} of ${data.length} items`);
    }

    console.log("\n📊 Upload Summary:");
    console.log("----------------");
    console.log(`✅ Successfully uploaded: ${successCount} items`);
    if (errorCount > 0) {
      console.log(`❌ Failed to upload: ${errorCount} items`);
      console.log("\nDetails of failed items:");
      errorDetails.forEach(({ item, errors }) => {
        console.log(`\nItem #${item} in Excel:`);
        errors.forEach((error) => console.log(`  - ${error}`));
      });
    }

    // After successful upload, get brand logos
    console.log("\n🔄 Starting to fetch brand logos...");
    await getBrandLogos();

    // Clean userfavorites and usercarts collections
    console.log("\n🧹 Cleaning user collections...");
    try {
      await db.collection("userfavorites").deleteMany({});
      await db.collection("usercarts").deleteMany({});
      console.log(
        "✅ Successfully cleaned userfavorites and usercarts collections"
      );
    } catch (err) {
      console.error("❌ Error cleaning user collections:", err.message);
    }
  } catch (err) {
    console.error("\n⚠️ ERROR:", err.message);
    if (err.code === "ENOENT") {
      console.error(
        "\nCould not find the Excel file 'Inventory.xlsx'.\nPlease make sure:\n1. The file exists\n2. It is named exactly 'Inventory.xlsx'\n3. It is in the same folder as this script"
      );
    } else if (err.name === "MongoServerError") {
      console.error(
        "\nCould not connect to the database.\nPlease check your internet connection and try again."
      );
    }
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("MongoDB connection closed");
    }
  }
}

// Get command line argument
const limit = process.argv[2] || "full";
uploadToMongo(limit).catch(console.error);
