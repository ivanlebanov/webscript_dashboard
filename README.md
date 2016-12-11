# webscript1
======

A simple example of an API-based web app.

This week we are not doing tests, instead you should make sure all your previous tests are passing, and then you can play with the JStagram example app. For inspiration, here is a list of things you might consider doing in JStagram:


 1. fix: delete an uploaded file if it isn't an image
 2. new feature: add paging to the main page to go beyond the first 10 results (use SQL `LIMIT` and `OFFSET` according to API parameters you define)
 3. new feature: add a per-picture page to show a single picture nicely
 4. new feature: look for a thumbnail package and process the image into full resolution for viewing and thumbnail for the index page
 5. new feature if you like databases: make title search full-text - MySQL has fulltext indexes and search functions



Running JStagram
----------------

To get the example running, you must install the source code and all modules and then run the server from the command line:

1. To download the code, either use git (the simplest option):

  ```bash
  git clone https://github.com/portsoc/ws_api.git
  cd ws_api
  ```
  or download and unpack the [zip](https://github.com/portsoc/ws_api/archive/master.zip)
  which on linux can be achieved using
  ```bash
  wget https://github.com/portsoc/ws_api/archive/master.zip
  ```
  then
  ```bash
  unzip master.zip
  cd ws_api-master
  ```

2. To download any libraries the code uses, type:

  ```bash
  npm install
  ```

3. Install and run MySQL.
    * If you're using your VM for this, MySQL is already installed and running.

4. Edit `examples/sql_config.json` so that your database `host`, `user` and `password` properties are correct.
    * The defaults should work on your VM.

5. Install the database and tables using: `npm run initsql`
    * If your `host` and `user` differ from the defaults, you may need to update `package.json` for the `initsql` script to work.

6. Start the server by typing:

  ```bash
  npm run forever
  ```

  This ensures that if you edit the code (or upload a new version), the server will restart.

5. Visit your website.
    * If you're on your VM you just need to put your VM's IP address into a browser, or if you're developing on a desktop machine it will be http://127.0.0.1:8080 .

Git: A recommendation
----------------------
If at all possible, we recommend you use git to download code rather than zips of a repository.  This is preferable because if the repo is updated, then syncing those changes requires just one command (`git pull`) and usually any merging can be done automatically.  Git is very powerful and we heartily encourages you to become familiar with it.
