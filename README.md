# VibeOps Construction Tracker

A powerful construction project management tool that helps track project progress, generate Gantt charts, and analyze project performance through S-curves.

## Features

- Project planning with Gantt chart visualization
- Critical Path Method (CPM) analysis
- Progress tracking with S-curve generation
- Earned Value Management (EVM) metrics
- Real-time data persistence with Supabase
- Modern, responsive UI with dark theme

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (optional, for version control)
- Supabase account (for database)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd site-v1
   ```

2. **Create a Virtual Environment**
   ```bash
   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies [[Sometimes have to run twice or upgrade pip :] ]**
   ```bash
   pip install -r requirements.txt 
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the project root with the following variables:
   ```
   SUPABASE_URL="your-supabase-url"
   SUPABASE_KEY="your-supabase-key"
   DATABASE_URL="your-database-url"
   DIRECT_URL="your-direct-url"
   FLASK_SECRET_KEY="your-secret-key"
   ```

5. **Initialize Database**
   Run the following SQL commands in your Supabase SQL editor:
   ```sql
   -- Create projects table
   CREATE TABLE projects (
       id BIGSERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create tasks table
   CREATE TABLE tasks (
       id BIGSERIAL PRIMARY KEY,
       project_id BIGINT REFERENCES projects(id),
       activity_name TEXT NOT NULL,
       start_date DATE NOT NULL,
       duration INTEGER NOT NULL,
       immediate_predecessor TEXT[],
       percent_complete FLOAT DEFAULT 0,
       budgeted_cost FLOAT DEFAULT 0,
       actual_cost FLOAT DEFAULT 0,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create s_curves table
   CREATE TABLE s_curves (
       id BIGSERIAL PRIMARY KEY,
       project_id BIGINT REFERENCES projects(id),
       data JSONB NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create indexes
   CREATE INDEX idx_tasks_project_id ON tasks(project_id);
   CREATE INDEX idx_tasks_activity_name ON tasks(activity_name);
   CREATE INDEX idx_s_curves_project_id ON s_curves(project_id);
   ```

6. **Run the Application**
   ```bash
   python app.py
   ```
   The application will be available at http://127.0.0.1:8800/

## Usage

1. **Create a New Project**
   - Enter project name
   - Add tasks with start dates, durations, and dependencies
   - Click "Generate Gantt" to create the project plan

2. **Track Progress**
   - Enter progress percentages for each task
   - Add budgeted and actual costs
   - Click "Submit Progress" to generate S-curves and metrics

3. **View Analysis**
   - Gantt chart shows task dependencies and critical path
   - S-curve displays budgeted vs. actual costs
   - Performance metrics show schedule and cost variances

## Development

### Project Structure
```
site-v1/
├── app.py              # Main Flask application
├── tracker.py          # Project tracking logic
├── static/            # Static files (CSS, JS)
├── templates/         # HTML templates
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

### Key Dependencies
- Flask: Web framework
- Supabase: Database and authentication
- Plotly: Data visualization
- pandas: Data manipulation
- python-dotenv: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- VibeOps team for the original concept
- Supabase for database infrastructure
- Plotly for visualization capabilities
