-- Sales Pipeline Table
CREATE TABLE sales_pipeline (
    id SERIAL PRIMARY KEY,
    enquiry_date DATE,
    lead VARCHAR(10),
    lead_qualified_date DATE,
    sales_order VARCHAR(20),
    sales_order_date DATE,
    month VARCHAR(20),
    sales_cycle INTEGER,
    invoice_date DATE,
    invoice_month VARCHAR(20),
    invoice_value DECIMAL(15,2),
    city VARCHAR(100),
    state VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employability Table
CREATE TABLE employability (
    id SERIAL PRIMARY KEY,
    date DATE,
    month VARCHAR(20),
    admin_present INTEGER,
    admin_leave INTEGER,
    admin_separated INTEGER,
    admin_reason_attrition VARCHAR(100),
    dl_present INTEGER,
    dl_leave INTEGER,
    dl_separated INTEGER,
    dl_reason_attrition VARCHAR(100),
    idl_present INTEGER,
    idl_leave INTEGER,
    idl_separated INTEGER,
    idl_reason_attrition VARCHAR(100),
    date_of_replacement DATE,
    total_days_to_recruit INTEGER,
    hr_ir_count INTEGER,
    finance_account_count INTEGER,
    sales_marketing_count INTEGER,
    operations_count INTEGER,
    it_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality Table
CREATE TABLE quality (
    id SERIAL PRIMARY KEY,
    date DATE,
    month VARCHAR(20),
    product_produced INTEGER,
    product_rejected INTEGER,
    reason_for_rejection VARCHAR(100),
    product_shipped INTEGER,
    product_returned INTEGER,
    product_remake INTEGER,
    cost_of_remake DECIMAL(15,2),
    product_repaired INTEGER,
    cost_of_repair DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery Table
CREATE TABLE delivery (
    id SERIAL PRIMARY KEY,
    order_date DATE,
    month VARCHAR(20),
    order_value DECIMAL(15,2),
    estimated_ship_date DATE,
    actual_ship_date DATE,
    ship_month VARCHAR(20),
    lead_time INTEGER,
    delayed INTEGER,
    delayed_order_value DECIMAL(15,2),
    reason_for_delay VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

-- Sales Pipeline Data
INSERT INTO sales_pipeline (enquiry_date, lead, lead_qualified_date, sales_order, sales_order_date, month, sales_cycle, invoice_date, invoice_month, invoice_value, city, state) VALUES
('2025-01-27', 'Yes', '2025-03-13', 'Won', '2025-05-12', 'Apr-25', 105, '2025-06-11', 'Jun-25', 500000, 'Ahmedabad', 'GJ'),
('2025-02-01', 'Yes', '2025-03-18', 'No', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Vadodara', 'GJ'),
('2025-02-05', 'Yes', '2025-03-22', 'No', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Indore', 'MP'),
('2025-02-05', 'Yes', '2025-03-22', 'Lost', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Bhuvneshwar', 'OR'),
('2025-02-06', 'Yes', '2025-04-21', 'Won', '2025-06-20', 'May-25', 135, '2025-08-19', 'Jul-25', 750000, 'Mumbai', 'MH'),
('2025-02-06', 'No', '2025-03-23', 'No', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Surat', 'GJ'),
('2025-02-06', 'Yes', '2025-03-23', 'No', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Nashik', 'MH'),
('2025-02-07', 'Yes', '2025-03-24', 'Lost', NULL, 'Jan-00', 0, NULL, 'Jan-00', NULL, 'Delhi', 'DL'),
('2025-02-09', 'Yes', '2025-04-09', 'Won', '2025-06-08', 'Jun-25', 160, '2025-08-07', 'Aug-25', 1500000, 'Vadodara', 'GJ');

-- Employability Data  
INSERT INTO employability (date, month, admin_present, admin_leave, admin_separated, admin_reason_attrition, dl_present, dl_leave, dl_separated, dl_reason_attrition, idl_present, idl_leave, idl_separated, idl_reason_attrition, date_of_replacement, total_days_to_recruit, hr_ir_count, finance_account_count, sales_marketing_count, operations_count, it_count) VALUES
('2025-01-23', 'Jan-25', 10, 1, 1, 'Better Opportunity', 10, 1, 1, 'Better Opportunity', 10, 1, 1, 'Better Opportunity', '2025-03-23', 60, 2, 2, 4, 8, 1),
('2025-01-24', 'Jan-25', 11, 0, 0, NULL, 11, 0, 0, NULL, 11, 0, 0, NULL, NULL, NULL, 2, 2, 4, 8, 1),
('2025-01-25', 'Jan-25', 10, 1, 0, NULL, 10, 1, 0, NULL, 10, 1, 0, NULL, NULL, NULL, 2, 2, 4, 8, 1),
('2025-01-26', 'Jan-25', 11, 0, 0, NULL, 11, 0, 0, NULL, 11, 0, 0, NULL, NULL, NULL, 2, 2, 4, 8, 1),
('2025-01-27', 'Jan-25', 11, 0, 0, NULL, 11, 0, 0, NULL, 11, 0, 0, NULL, NULL, NULL, 2, 2, 4, 8, 1);

-- Quality Data
INSERT INTO quality (date, month, product_produced, product_rejected, reason_for_rejection, product_shipped, product_returned, product_remake, cost_of_remake, product_repaired, cost_of_repair) VALUES
('2025-01-23', 'Jan-25', 1200, 20, 'Specification', 1500, 2, 1, 100000, 3, 75000),
('2025-01-24', 'Jan-25', 1000, 22, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2025-01-25', 'Jan-25', 1250, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2025-01-26', 'Jan-25', 1100, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2025-01-27', 'Jan-25', 1200, 40, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Delivery Data
INSERT INTO delivery (order_date, month, order_value, estimated_ship_date, actual_ship_date, ship_month, lead_time, delayed, delayed_order_value, reason_for_delay) VALUES
('2025-01-23', 'Jan-25', 500000, '2025-02-23', '2025-02-23', 'Feb-25', 31, 0, 0, NULL),
('2025-01-24', 'Jan-25', 650000, '2025-02-28', '2025-02-28', 'Feb-25', 35, 0, 0, NULL),
('2025-01-25', 'Jan-25', 890000, '2025-02-26', '2025-03-01', 'Feb-25', 35, 1, 890000, 'No RM'),
('2025-01-26', 'Jan-25', 1000000, '2025-03-03', '2025-03-02', 'Feb-25', 35, 0, 0, NULL),
('2025-01-27', 'Jan-25', 500000, '2025-03-04', '2025-03-03', 'Feb-25', 35, 0, 0, NULL);

-- Create indexes for better performance
CREATE INDEX idx_sales_pipeline_invoice_date ON sales_pipeline(invoice_date);
CREATE INDEX idx_employability_date ON employability(date);
CREATE INDEX idx_quality_date ON quality(date);
CREATE INDEX idx_delivery_order_date ON delivery(order_date);