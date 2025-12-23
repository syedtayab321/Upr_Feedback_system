Project Setup (Windows)
Step 1: Navigate to the Ai folder and create a virtual environment
cd "Your Folder\Feedback System\Ai"
python -m venv venv

Step 2: Activate the virtual environment and install dependencies
venv\Scripts\Activate
pip install -r requirements.txt

Step 3: Navigate to the code folder and run the application
cd code
uvicorn main:app --host 0.0.0.0 --port 8001