[![Angular Tests](https://github.com/anandteertha/SE-PROJECT/actions/workflows/angular-tests.yml/badge.svg?branch=main)](https://github.com/anandteertha/SE-PROJECT/actions/workflows/angular-tests.yml)
[![codecov](https://codecov.io/gh/anandteertha/SE-PROJECT/branch/main/graph/badge.svg)](https://codecov.io/gh/anandteertha/SE-PROJECT)
![Version](https://img.shields.io/badge/version-v1.0.2-blue)
[![Render – API Live](https://img.shields.io/badge/Render-API%20Live-46E3B7?logo=render&logoColor=white)](https://se-project-ey8h.onrender.com)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white&style=for-the-badge)](https://www.netlify.com/)
[![TiDB Serverless (MySQL)](https://img.shields.io/badge/TiDB-Serverless%20(MySQL)-E30C34?logo=tidb&logoColor=white)](https://tidbcloud.com/)
[![Angular 20](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Python 3.13](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Cypress](https://img.shields.io/badge/Tested%20with-Cypress-04C38E?logo=cypress&logoColor=white)](https://www.cypress.io/)


# Current Version: v1.0.2
#### NOTE: checkout `rules.md` for a better sense of the conventions followed in this project.

## Setup
1. Current python version used for development v3.13.7
2. `cd src\backend `pip install -m requirements.txt` to install all the python dependencies.
3. Download & Install mysql workbench https://dev.mysql.com/downloads/workbench/.
4. create a file `.env` in `cd src\backend` & add the below contents in it.
   1. DB_HOST=127.0.0.1
   2. DB_USERNAME=your-workbench-connection-username
   3. DB_PASSWORD=your-workbench-connection-password
   4. PORT=3306
5. cd src `python -m backend.queries.static_data` to post static data into the database.
6. Start the flask server `cd src\backend` `python -m app.py`
7. Current node.js version used for development v22.20.0
8. `cd src\client\nutri-bite `npm i`
9. Start the front-end server `npm start`
