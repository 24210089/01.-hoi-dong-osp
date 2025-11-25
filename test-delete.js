const pool = require("./src/config/database");

async function fixAndTestDelete() {
  const conn = await pool.getConnection();
  try {
    // Fix records with empty status
    console.log("--- Fixing records with empty status ---");
    const [fixResult] = await conn.query(
      "UPDATE sisters SET status = 'active' WHERE status = '' OR status IS NULL"
    );
    console.log("Fixed", fixResult.affectedRows, "records");

    // Show status distribution
    const [dist] = await conn.query(
      "SELECT status, COUNT(*) as count FROM sisters GROUP BY status"
    );
    console.log("Status distribution:", dist);

    // Test delete by updating id=1 to 'left'
    console.log("\n--- Test: Update sister id=1 to left ---");
    const [before] = await conn.query(
      "SELECT id, code, status FROM sisters WHERE id = 1"
    );
    console.log("Before:", before);

    const [result] = await conn.query(
      "UPDATE sisters SET status = 'left' WHERE id = 1"
    );
    console.log("Affected rows:", result.affectedRows);

    const [after] = await conn.query(
      "SELECT id, code, status FROM sisters WHERE id = 1"
    );
    console.log("After:", after);

    // Test filter - should NOT include id=1
    console.log("\n--- Filtered results (status = active only): ---");
    const [filtered] = await conn.query(
      "SELECT id, code, status FROM sisters WHERE status = 'active'"
    );
    console.log(filtered);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

fixAndTestDelete();
