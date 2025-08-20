const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const qualityTrends = await pool.query(`
        SELECT 
          TO_CHAR(date, 'Mon-YY') as month,
          AVG((product_rejected::float / product_produced) * 100) as rejection_rate,
          AVG((product_returned::float / product_shipped) * 100) as return_rate,
          SUM(cost_of_repair + cost_of_remake) as quality_costs
        FROM quality
        WHERE product_produced > 0
        GROUP BY TO_CHAR(date, 'Mon-YY'), DATE_TRUNC('month', date)
        ORDER BY DATE_TRUNC('month', date) DESC
        LIMIT 12
      `);

      const rejectionReasons = await pool.query(`
        SELECT reason_for_rejection as reason, COUNT(*) as count
        FROM quality 
        WHERE reason_for_rejection IS NOT NULL
        GROUP BY reason_for_rejection
        ORDER BY count DESC
      `);

      const costBreakdown = await pool.query(`
        SELECT 
          SUM(cost_of_repair) as repair_costs,
          SUM(cost_of_remake) as remake_costs,
          COUNT(CASE WHEN product_returned > 0 THEN 1 END) as return_incidents
        FROM quality
        WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      `);

      res.json({
        quality_trends: qualityTrends.rows,
        rejection_reasons: rejectionReasons.rows,
        cost_breakdown: costBreakdown.rows[0]
      });
    } catch (err) {
      console.error('Error fetching quality data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const query = `
        INSERT INTO quality (
          date, product_produced, product_rejected, reason_for_rejection,
          product_shipped, product_returned, product_remake, cost_of_remake,
          product_repaired, cost_of_repair
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        req.body.date,
        req.body.product_produced || 0,
        req.body.product_rejected || 0,
        req.body.reason_for_rejection || null,
        req.body.product_shipped || 0,
        req.body.product_returned || 0,
        req.body.product_remake || 0,
        req.body.cost_of_remake || 0,
        req.body.product_repaired || 0,
        req.body.cost_of_repair || 0
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding quality data:', err);
      res.status(500).json({ error: 'Failed to add quality data' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}