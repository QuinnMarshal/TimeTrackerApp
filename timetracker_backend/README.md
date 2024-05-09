# Backend Setup for TimeTrackerApp

## Description

This is the backend setup for TimeTrackerApp. It is built with Django and Django REST Framework.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of Python and pip.
* You have a Windows/Linux/Mac machine. State which OS is supported/required.
* It is highly recommended that you create a Virtual Environment (you can do so by running "python3 -m venv env" in your terminal).

## Installation

To install the project, follow these steps:

1. Clone the repository in your terminal:

```bash
git clone https://github.com/QuinnMarshal/TimeTrackerApp.git
```

2. Navigate into the project directory:

```bash
cd TimeTrackerApp
```

3. Activate the virtual environment (if applicable):

```bash
source env/bin/activate  
# On Windows use `env\Scripts\activate`
```
4. Install the project dependencies:

```bash
pip install -r requirements.txt
```

## Usage

To use the project, follow these steps:

1. Apply the migrations:

```bash
python manage.py migrate
```

2. Start the development server:

```bash
python manage.py runserver
```

3. Open your browser and navigate to http://localhost:8000.