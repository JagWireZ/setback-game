// test/run_tests.js

import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname);

const testFiles = fs
  .readdirSync(TEST_DIR)
  .filter(f => f.startsWith("test_") && f.endsWith(".js"))
  .sort();

const run = async () => {
  console.log("========================================");
  console.log("     REMOTE BACKEND INTEGRATION TESTS   ");
  console.log("========================================\n");

  for (const file of testFiles) {
    const fullPath = path.join(TEST_DIR, file);

    console.log(`▶ Running ${file}`);

    try {
      await import(url.pathToFileURL(fullPath));
      console.log(`✔ PASS: ${file}\n`);
    } catch (err) {
      console.error(`✖ FAIL: ${file}`);
      console.error(err);
      console.log("\nStopping test runner due to failure.\n");
      process.exit(1);
    }
  }

  console.log("========================================");
  console.log("     ALL REMOTE TESTS PASSED SUCCESS    ");
  console.log("========================================\n");
};

run();
