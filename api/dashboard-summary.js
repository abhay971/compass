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
    const salesData = await pool.query(`
      SELECT 
        COALESCE(SUM(invoice_value), 0) as ytd_sales,
        COALESCE(AVG(sales_cycle), 0) as avg_sales_cycle,
        COALESCE(AVG(CASE WHEN sales_order = 'Won' THEN 1 ELSE 0 END) * 100, 0) as conversion_rate,
        COALESCE(AVG(invoice_value), 0) as avg_order_value
      FROM sales_pipeline 
      WHERE invoice_date >= DATE_TRUNC('year', CURRENT_DATE)
    `);

    const employabilityData = await pool.query(`
      SELECT 
        COALESCE(AVG(((admin_present + dl_present + idl_present)::float / 
                     (admin_present + dl_present + idl_present + admin_separated + dl_separated + idl_separated)) * 100), 0) as retention_rate,
        COALESCE(AVG(total_days_to_recruit), 0) as avg_recruitment_days
      FROM employability 
      WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `);

    const qualityData = await pool.query(`
      SELECT 
        COALESCE(AVG((product_rejected::float / product_produced) * 100), 0) as rejection_rate,
        COALESCE(AVG((product_returned::float / product_shipped) * 100), 0) as return_rate,
        COALESCE(SUM(cost_of_repair + cost_of_remake), 0) as total_quality_cost
      FROM quality 
      WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `);

    const deliveryData = await pool.query(`
      SELECT 
        COALESCE(AVG(CASE WHEN delayed = 0 THEN 1 ELSE 0 END) * 100, 0) as on_time_delivery,
        COALESCE(AVG(lead_time), 0) as avg_lead_time,
        COALESCE(SUM(CASE WHEN delayed = 1 THEN 1 ELSE 0 END), 0) as delayed_orders,
        COALESCE(SUM(delayed_order_value), 0) as delayed_order_value
      FROM delivery 
      WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `);

    res.json({
      sales_pipeline: salesData.rows[0],
      employability: employabilityData.rows[0],
      quality: qualityData.rows[0],
      delivery: deliveryData.rows[0]
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message
    });
  }
}