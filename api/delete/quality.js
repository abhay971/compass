const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await pool.query('DELETE FROM quality WHERE id = $1', [id]);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting quality record:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
}