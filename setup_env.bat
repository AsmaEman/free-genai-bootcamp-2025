@echo off
REM Create virtual environment
python -m venv .venv

REM Activate virtual environment
call .venv\Scripts\activate

REM Install requirements
pip install -r language-learning-assistant/backend/requirements.txt

echo Virtual environment setup complete.
pause
