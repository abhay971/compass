# Project Management System Dashboard

A comprehensive dashboard for tracking 4 key KPIs based on your Excel data:
- **Sales Pipeline** - Revenue tracking and conversion analysis
- **Employability** - Workforce management and retention analytics  
- **Quality** - Product quality metrics and cost analysis
- **Delivery** - On-time delivery tracking and lead time analysis

## Features

- Professional dashboard with 4 main KPI cards
- Detailed drill-down pages with interactive charts
- Real-time data visualization using Recharts
- Responsive design with brand colors (#F37E3A, #288EC2, #6EBD49, #000000)
- PostgreSQL database with sample data from your Excel sheet
- RESTful API with Express.js
- React with TypeScript frontend

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database named `pms_dashboard`
2. Update database credentials in `server/.env`
3. Run the database schema:

```bash
# Connect to PostgreSQL and run
psql -U postgres -d pms_dashboard -f server/database.sql
```

### 3. Environment Configuration

Update `server/.env` with your database credentials:

```env
PORT=5000
DB_USER=your_username
DB_HOST=localhost
DB_NAME=pms_dashboard
DB_PASSWORD=your_password
DB_PORT=5432
```

### 4. Run the Application

```bash
# Start both server and client (from root directory)
npm run dev

# Or start separately:
# Server (from server directory)
npm run dev

# Client (from client directory)  
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
PMS_2/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── database.sql       # Database schema
│   └── .env              # Environment variables
└── package.json          # Root package.json
```

## API Endpoints

- `GET /api/dashboard/summary` - Main KPI summary data
- `GET /api/sales-pipeline` - Detailed sales pipeline data
- `GET /api/employability` - Detailed employability data
- `GET /api/quality` - Detailed quality data
- `GET /api/delivery` - Detailed delivery data

## KPI Metrics

### Sales Pipeline
- YTD Sales (INR)
- Average Sales Cycle (Days)
- Lead Conversion Rate (%)
- Average Order Value (INR)

### Employability  
- Retention Rate (%)
- Average Recruitment Time (Days)
- Department Headcount
- Attrition Reasons

### Quality
- Rejection Rate (%)
- Return Rate (%)
- Quality Costs (INR)
- Rejection Reasons

### Delivery
- On-time Delivery Rate (%)
- Average Lead Time (Days)
- Delayed Orders Count
- Delayed Order Value (INR)

## Brand Colors
- Primary Orange: #F37E3A
- Primary Blue: #288EC2  
- Primary Green: #6EBD49
- Primary Black: #000000