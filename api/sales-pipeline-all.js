const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await pool.query('SELECT * FROM sales_pipeline ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sales data:', err);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
}