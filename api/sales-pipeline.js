const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const monthlyData = await pool.query(`
        SELECT 
          TO_CHAR(invoice_date, 'Mon-YY') as month,
          SUM(invoice_value) as total_sales,
          AVG(sales_cycle) as avg_cycle,
          COUNT(*) as total_orders
        FROM sales_pipeline 
        WHERE invoice_date IS NOT NULL
        GROUP BY TO_CHAR(invoice_date, 'Mon-YY'), DATE_TRUNC('month', invoice_date)
        ORDER BY DATE_TRUNC('month', invoice_date) DESC
        LIMIT 12
      `);

      const conversionFunnel = await pool.query(`
        SELECT 
          'Enquiries' as stage, COUNT(*) as count
        FROM sales_pipeline
        UNION ALL
        SELECT 
          'Leads' as stage, COUNT(*) as count
        FROM sales_pipeline WHERE lead = 'Yes'
        UNION ALL
        SELECT 
          'Opportunities' as stage, COUNT(*) as count
        FROM sales_pipeline WHERE lead_qualified_date IS NOT NULL
        UNION ALL
        SELECT 
          'Won' as stage, COUNT(*) as count
        FROM sales_pipeline WHERE sales_order = 'Won'
      `);

      const geographicData = await pool.query(`
        SELECT state, SUM(invoice_value) as total_value, COUNT(*) as orders
        FROM sales_pipeline 
        WHERE invoice_value IS NOT NULL
        GROUP BY state
        ORDER BY total_value DESC
      `);

      res.json({
        monthly_trends: monthlyData.rows,
        conversion_funnel: conversionFunnel.rows,
        geographic_distribution: geographicData.rows
      });
    } catch (err) {
      console.error('Error fetching sales pipeline data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const query = `
        INSERT INTO sales_pipeline (
          enquiry_date, lead, lead_qualified_date, sales_order, sales_order_date, 
          sales_cycle, invoice_date, invoice_value, city, state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        req.body.enquiry_date || null,
        req.body.lead,
        req.body.lead_qualified_date || null,
        req.body.sales_order,
        req.body.sales_order_date || null,
        req.body.sales_cycle || null,
        req.body.invoice_date || null,
        req.body.invoice_value || null,
        req.body.city || null,
        req.body.state || null
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding sales data:', err);
      res.status(500).json({ error: 'Failed to add sales data' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}