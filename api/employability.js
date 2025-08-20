const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const departmentData = await pool.query(`
        SELECT 
          'Admin' as department, AVG(admin_present) as present, AVG(admin_separated) as separated
        FROM employability
        UNION ALL
        SELECT 
          'DL' as department, AVG(dl_present) as present, AVG(dl_separated) as separated
        FROM employability
        UNION ALL
        SELECT 
          'IDL' as department, AVG(idl_present) as present, AVG(idl_separated) as separated
        FROM employability
      `);

      const attritionReasons = await pool.query(`
        SELECT admin_reason_attrition as reason, COUNT(*) as count
        FROM employability 
        WHERE admin_reason_attrition IS NOT NULL
        GROUP BY admin_reason_attrition
        UNION ALL
        SELECT dl_reason_attrition as reason, COUNT(*) as count
        FROM employability 
        WHERE dl_reason_attrition IS NOT NULL
        GROUP BY dl_reason_attrition
        UNION ALL
        SELECT idl_reason_attrition as reason, COUNT(*) as count
        FROM employability 
        WHERE idl_reason_attrition IS NOT NULL
        GROUP BY idl_reason_attrition
        ORDER BY count DESC
      `);

      const retentionTrend = await pool.query(`
        SELECT 
          TO_CHAR(date, 'Mon-YY') as month,
          AVG((admin_present + dl_present + idl_present)::float / 
              (admin_present + dl_present + idl_present + admin_separated + dl_separated + idl_separated) * 100) as retention_rate
        FROM employability
        GROUP BY TO_CHAR(date, 'Mon-YY'), DATE_TRUNC('month', date)
        ORDER BY DATE_TRUNC('month', date) DESC
        LIMIT 12
      `);

      res.json({
        department_headcount: departmentData.rows,
        attrition_reasons: attritionReasons.rows,
        retention_trends: retentionTrend.rows
      });
    } catch (err) {
      console.error('Error fetching employability data:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const query = `
        INSERT INTO employability (
          date, admin_present, admin_leave, admin_separated, admin_reason_attrition,
          dl_present, dl_leave, dl_separated, dl_reason_attrition,
          idl_present, idl_leave, idl_separated, idl_reason_attrition,
          total_days_to_recruit, hr_ir_count, finance_account_count, 
          sales_marketing_count, operations_count, it_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;
      
      const values = [
        req.body.date,
        req.body.admin_present || 0,
        req.body.admin_leave || 0,
        req.body.admin_separated || 0,
        req.body.admin_reason_attrition || null,
        req.body.dl_present || 0,
        req.body.dl_leave || 0,
        req.body.dl_separated || 0,
        req.body.dl_reason_attrition || null,
        req.body.idl_present || 0,
        req.body.idl_leave || 0,
        req.body.idl_separated || 0,
        req.body.idl_reason_attrition || null,
        req.body.total_days_to_recruit || null,
        req.body.hr_ir_count || 0,
        req.body.finance_account_count || 0,
        req.body.sales_marketing_count || 0,
        req.body.operations_count || 0,
        req.body.it_count || 0
      ];
      
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error adding employability data:', err);
      res.status(500).json({ error: 'Failed to add employability data' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}