const express = require('express');
const cors = require('cors');

// Import all your existing handlers
const dashboardSummary = require('./dashboard-summary');
const delivery = require('./delivery');
const deliveryAll = require('./delivery-all');
const employability = require('./employability');
const employabilityAll = require('./employability-all');
const quality = require('./quality');
const qualityAll = require('./quality-all');
const salesPipeline = require('./sales-pipeline');
const salesPipelineAll = require('./sales-pipeline-all');

// Import delete handlers
const deleteDelivery = require('./delete/delivery');
const deleteEmployability = require('./delete/employability');
const deleteQuality = require('./delete/quality');
const deleteSalesPipeline = require('./delete/sales-pipeline');

const app = express();

app.use(cors());
app.use(express.json());

// Route all endpoints
app.use('/dashboard-summary', dashboardSummary);
app.use('/delivery', delivery);
app.use('/delivery-all', deliveryAll);
app.use('/employability', employability);
app.use('/employability-all', employabilityAll);
app.use('/quality', quality);
app.use('/quality-all', qualityAll);
app.use('/sales-pipeline', salesPipeline);
app.use('/sales-pipeline-all', salesPipelineAll);

// Delete routes
app.use('/delete/delivery', deleteDelivery);
app.use('/delete/employability', deleteEmployability);
app.use('/delete/quality', deleteQuality);
app.use('/delete/sales-pipeline', deleteSalesPipeline);

module.exports = app;