const XLSX = require("xlsx");
const { exec } = require("child_process");
const readline = require("readline");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function checkExcelFile() {
  try {
    // Read the Excel file
    console.log("📊 Checking Inventory.xlsx file...");
    const workbook = XLSX.readFile("Inventory.xlsx");
    const worksheet = workbook.Sheets["Stock"];

    if (!worksheet) {
      console.error(
        "\n❌ ERROR: Could not find the 'Stock' sheet in your Excel file."
      );
      console.log("Please make sure:");
      console.log("1. Your Excel file is named 'Inventory.xlsx'");
      console.log("2. It contains a sheet named 'Stock'");
      console.log("3. The file is in the same folder as this script");
      process.exit(1);
    }

    // Convert to JSON to count records
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`\n📈 Total records found in Inventory.xlsx: ${data.length}`);

    // Ask user how many records to upload
    rl.question(
      "\nHow many records would you like to upload? (Enter 'full' for all records or a number): ",
      (answer) => {
        let command = "node uploadStock.js";

        if (answer.toLowerCase() === "full") {
          command += " full";
        } else {
          const num = parseInt(answer);
          if (isNaN(num) || num <= 0) {
            console.error(
              "\n❌ Invalid input. Please enter 'full' or a positive number."
            );
            rl.close();
            return;
          }
          command += ` ${num}`;
        }

        console.log(`\n🚀 Starting upload process with command: ${command}`);

        // Execute the upload script
        const child = exec(command);

        // Handle output
        child.stdout.on("data", (data) => {
          process.stdout.write(data);
        });

        child.stderr.on("data", (data) => {
          process.stderr.write(data);
        });

        child.on("close", (code) => {
          console.log(`\n✨ Upload process completed with exit code ${code}`);
          rl.close();
        });
      }
    );
  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    if (err.code === "ENOENT") {
      console.error("\nCould not find the Excel file 'Inventory.xlsx'.");
      console.log("Please make sure:");
      console.log("1. The file exists");
      console.log("2. It is named exactly 'Inventory.xlsx'");
      console.log("3. It is in the same folder as this script");
    }
    rl.close();
    process.exit(1);
  }
}

// Start the process
checkExcelFile();
