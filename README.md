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
6. Start the flask server `cd src` `python -m backend.app`
7. Current node.js version used for development v22.20.0
8. `cd src\client\nutri-bite `npm i`
9. Start the front-end server `npm start`