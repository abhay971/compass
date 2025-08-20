const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const deliveryTrends = await pool.query(`
        SELECT 
          TO_CHAR(order_date, 'Mon-YY') as month,
          AVG(CASE WHEN delayed = 0 THEN 1 ELSE 0 END) * 100 as on_time_rate,
          AVG(lead_time) as avg_lead_time,
          SUM(CASE WHEN delayed = 1 THEN 1 ELSE 0 END) as delayed_orders
        FROM delivery
        GROUP BY TO_CHAR(order_date, 'Mon-YY'), DATE_TRUNC('month', order_date)
        ORDER BY DATE_TRUNC('month', order_date) DESC
        LIMIT 12
      `);

      const delayReasons = await pool.query(`
        SELECT reason_for_delay as reason, COUNT(*) as count, SUM(delayed_order_value) as value
        FROM delivery 
        WHERE reason_for_delay IS NOT NULL
        GROUP BY reason_for_delay
        ORDER BY count DESC
      `);

      const leadTimeDistribution = await pool.query(`
        SELECT 
          CASE 
            WHEN lead_time <= 30 THEN '≤30 days'
            WHEN lead_time <= 60 THEN '31-60 days'
            WHEN lead_time <= 90 THEN '61-90 days'
            ELSE '>90 days'
          END as lead_time_bucket,
          COUNT(*) as count
        FROM delivery
        GROUP BY 
          CASE 
            WHEN lead_time <= 30 THEN '≤30 days'
            WHEN lead_time <= 60 THEN '31-60 days'
            WHEN lead_time <= 90 THEN '61-90 days'
            ELSE '>90 days'
          END
        ORDER BY COUNT(*) DESC
      `);

      res.json({
        delivery_trends: deliveryTrends.rows,
        delay_reasons: delayReasons.rows,
        lead_time_distribution: leadTimeDistribution.rows
      });
    } catch (err) {
      console.error('Error fetching delivery data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const query = `
        INSERT INTO delivery (
          order_date, order_value, estimated_ship_date, actual_ship_date,
          lead_time, delayed, delayed_order_value, reason_for_delay
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const values = [
        req.body.order_date,
        req.body.order_value || 0,
        req.body.estimated_ship_date || null,
        req.body.actual_ship_date || null,
        req.body.lead_time || null,
        req.body.delayed || 0,
        req.body.delayed_order_value || 0,
        req.body.reason_for_delay || null
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding delivery data:', err);
      res.status(500).json({ error: 'Failed to add delivery data' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}