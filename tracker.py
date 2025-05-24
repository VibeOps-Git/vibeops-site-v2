from flask import request, jsonify, render_template
import pandas as pd
import os, io, json
from config import supabase

def handle_tracker_post():
    if request.method == 'POST':
        try:
            project_name = request.form.get('project_name')
            data_file = request.files.get('data_file')

            if not project_name or not data_file:
                return jsonify({"error": "Missing project name or data file"}), 400

            # Determine file type and read with pandas
            file_content = data_file.read()
            file_extension = os.path.splitext(data_file.filename)[1].lower()

            try:
                if file_extension == '.csv':
                    df = pd.read_csv(io.BytesIO(file_content))
                elif file_extension in ['.xls', '.xlsx']:
                    df = pd.read_excel(io.BytesIO(file_content))
                else:
                    return jsonify({"error": "Unsupported file type"}), 400

                # Log columns to help with data processing logic development
                Logger.log(f"Uploaded file columns: {df.columns.tolist()}")

                # --- Construction Progress Analysis Logic (Placeholder) ---
                # TODO: Define expected column names and data format for the input file.
                # You will need to replace this placeholder logic with your actual analysis.
                
                # Example: Basic data aggregation
                analysis_results = {
                    "s_curve_data": [], # Placeholder for chart data
                    "evm_data": [],     # Placeholder for chart data
                    "critical_path_updates": "No critical path updates calculated yet.",
                    "data_summary": df.head().to_dict(orient='records') # Send first few rows as a list of records
                }

                try:
                    # Example: Assuming columns 'Planned Value', 'Earned Value', 'Actual Cost'
                    # Basic EVM calculation placeholders
                    total_pv = df['Planned Value'].sum() if 'Planned Value' in df.columns else 0
                    total_ev = df['Earned Value'].sum() if 'Earned Value' in df.columns else 0
                    total_ac = df['Actual Cost'].sum() if 'Actual Cost' in df.columns else 0

                    cv = total_ev - total_ac # Cost Variance
                    sv = total_ev - total_pv # Schedule Variance

                    analysis_results['cost_variance'] = cv
                    analysis_results['schedule_variance'] = sv

                    # Example: Placeholder for S-curve data (cumulative PV, EV, AC over time)
                    # Requires a 'Date' column and sorting
                    if 'Date' in df.columns:
                         df['Date'] = pd.to_datetime(df['Date'])
                         df = df.sort_values(by='Date')
                         df['Cumulative_PV'] = df['Planned Value'].cumsum() if 'Planned Value' in df.columns else 0
                         df['Cumulative_EV'] = df['Earned Value'].cumsum() if 'Earned Value' in df.columns else 0
                         df['Cumulative_AC'] = df['Actual Cost'].cumsum() if 'Actual Cost' in df.columns else 0

                         analysis_results['s_curve_data'] = df[['Date', 'Cumulative_PV', 'Cumulative_EV', 'Cumulative_AC']].to_dict(orient='records')

                    # Example: Placeholder for critical path updates (requires more complex logic/libraries)
                    # analysis_results['critical_path_updates'] = "Actual critical path analysis would go here." # Replace placeholder

                except KeyError as e:
                    Logger.log(f"Missing expected column for analysis: {e}")
                    analysis_results['analysis_error'] = f"Missing expected column: {e}. Please check your file format."
                except Exception as analysis_error:
                     Logger.log(f"Error during construction analysis: {analysis_error}")
                     analysis_results['analysis_error'] = f"Error during analysis: {analysis_error}"

                # --- End Analysis Logic ---

                # Store project info and potentially a link to the data/results in Supabase
                # Updated to also store basic analysis results and data summary
                supabase_insert_data = {
                    "project_name": project_name,
                    "analysis_summary": analysis_results # Store analysis results summary
                    # Consider storing the file content or a reference in Supabase Storage if needed
                }

                # If you have construction_projects and construction_progress_data tables as suggested:
                try:
                    # Assuming 'construction_projects' and 'construction_progress_data' tables exist
                    # First, insert/get the project
                    project_response = supabase.table('construction_projects').insert({
                        "project_name": project_name
                        # Add other project details if available from form/user context
                    }).execute()

                    project_id = None
                    if project_response.data and project_response.data[0]:
                        project_id = project_response.data[0]['id']
                        Logger.log(f"Inserted project with ID: {project_id}")

                        # Store a record of the analysis linked to the project
                        # Note: Storing entire DataFrame as JSON might hit size limits for large files
                        progress_data_response = supabase.table('construction_progress_data').insert({
                            "project_id": project_id,
                            "data_type": "uploaded_analysis", # Or 'planned', 'actual' based on file content
                            "progress_date": pd.to_datetime('today').normalize().isoformat(), # Use today's date for the analysis record
                            "progress_percentage": total_ev / total_pv * 100 if total_pv > 0 else 0, # Example: Overall progress
                            "cost_variance": cv,
                            "schedule_variance": sv,
                            "critical_path_updates": analysis_results["critical_path_updates"],
                            # "raw_data": df.to_json(orient='split') # Commented out due to potential size issues
                            "analysis_results_json": json.dumps(analysis_results) # Store results JSON
                        }).execute()

                        if progress_data_response.data is None and progress_data_response.error:
                            Logger.log(f"Supabase progress data insert error: {progress_data_response.error.message}")
                            # Handle error
                            pass

                    elif project_response.data is None and project_response.error:
                         Logger.log(f"Supabase project insert error: {project_response.error.message}")
                         # Handle error
                         pass

                except Exception as db_error:
                     Logger.log(f"General database error during tracker insert: {db_error}")
                     # Handle potential database exceptions
                     pass

                return jsonify({
                    "message": "File processed successfully",
                    "project_name": project_name,
                    "analysis_results": analysis_results # Return the analysis results
                }), 200

            except Exception as pandas_error:
                 Logger.log(f"Error processing file with pandas: {pandas_error}")
                 return jsonify({"error": "Error processing file"}), 500

        except Exception as e:
            Logger.log(f"Error processing construction tracker request: {e}")
            return jsonify({"error": "Internal server error"}), 500

    # Handle GET request for the page
    return render_template('construction_tracker.html')