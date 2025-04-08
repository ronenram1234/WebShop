const { MongoClient } = require("mongodb");
const XLSX = require("xlsx");

const DB_URI =
  "mongodb+srv://ronen_mong_user:0mj2Dg47uWydsmyq@ronen.bswne.mongodb.net/finalproject";
const STOCK_COLLECTION = "stock";
const OUTPUT_FILE = "StockData.xlsx";

async function downloadStock() {
  let client;
  try {
    // Connect to MongoDB
    client = await MongoClient.connect(DB_URI);
    console.log("Connected to MongoDB successfully");

    const db = client.db("finalproject");
    const collection = db.collection(STOCK_COLLECTION);

    // Get all documents from the collection
    console.log("Fetching data from MongoDB...");
    const data = await collection.find({}).toArray();
    console.log(`Found ${data.length} records`);

    if (data.length === 0) {
      console.log("No data found in the collection");
      return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");

    // Write the workbook to a file
    XLSX.writeFile(workbook, OUTPUT_FILE);
    console.log(`Data successfully exported to ${OUTPUT_FILE}`);

    // Print summary
    console.log("\nExport Summary:");
    console.log("--------------");
    console.log(`Total records exported: ${data.length}`);
    console.log(`Output file: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("\nMongoDB connection closed");
    }
  }
}

downloadStock().catch(console.error);
