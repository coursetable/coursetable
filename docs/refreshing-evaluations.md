# Refreshing evaluations

We need to refresh evaluations at the end of every semester. This needs to be at least partly done by a current Yale undergraduate.

Thanks for helping Yale students have up-to-date evaluations for course-shopping next semester!

## 1. Get the cookies to a logged-in session

1. Visit https://secure.its.yale.edu/cas/login
2. Open Chrome or Firefox developer tools, and switch to the Network tab
3. Sign in as usual
4. Visit https://secure.its.yale.edu/cas/login again: you should see this window
   ![Screenshot](https://i.imgur.com/Z7gWpAw.png)
5. Switch to the "Network" tab of the open Chrome developer tools, and copy the value of the "Cookie" header. It should look a bit like the below:
   ```
   CASTGC=TGT-321840-kaSBjvexb6F3fmVUehEyG1sEkzFSdDxsOvZU22RSDD6aDYCNVl-vmcasprd01; JSESSIONID=ACAE23522C9B3F381004B9B3C3BFB55E
   ```
   ![Screenshot of Google Chrome network debugger](https://i.imgur.com/mlTb5xG.png)

## 2. Run GetEvaluations.php

1. Make a copy of the empty SQLite database in `crawler/sqlite`

   ```sh
   # Say we're doing this for 201903 (2019 fall) evaluations

   # If doing this for another semester, substitute in
   # the other semester's number: e.g.,
   #
   # - Spring 2019: 201901
   # - Fall 2020: 202003

   # On Macs/Linux
   cp crawler/sqlite/blank.sqlite crawler/201903.sqlite

   # On Windows
   copy crawler/sqlite/blank.sqlite crawler/201903.sqlite
   ```

2. Run `php FetchRatings.php` with the file and season that we want to get the evaluations for:

   ```sh
   # For 201903 (Fall 2019)
   php crawler/FetchRatings.php --season 201903 --sqlite crawler/201903.sqlite
   ```

3. Select option 2 to enter a **browser login cookie**:

   ```
   We can either use a Yale CAS login to get evaluations, or rely on an
   existing login cookie (advanced, for technical users only). Please pick
   which you'd prefer:
   Enter 1 (and press enter) for Yale CAS login (RECOMMENDED)
   Enter 2 (and press enter) for browser login cookie

   > 2
   ```

4. Paste the cookie header from earlier:

   ```
   Please enter the cookies to sign in (should be the cookies sent in the
   request to https://secure.its.yale.edu/cas/login?service=...
   and should look like:
   CASTGC=blahblah-vmssoprdapp01; JSESSIONID=abcd; __cfduid=d8f78538117...

   > CASTGC=TGT-321840-kaSBjvexb6F3fmVUehEyG1sEkzFSdDxsOvZU22RSDD6aDYCNVl-vmcasprd01; JSESSIONID=ACAE23522C9B3F381004B9B3C3BFB55E
   ```

The program should now run, and take a few hours! Leave it running overnight.

If it stops or gets interrupted, just re-run steps 2-4 above.

## 3. Import the resulting SQLite file

To other developers: ask Peter or Harry to do this part!

1. Upload the .sqlite file to the server.
2. Compile Typescript files to regular Javascript:
   ```sh
   npm run build-crawler
   ```
3. Import the SQLite file:
   ```sh
   node dist/crawler/ImportSQLiteEvaluations.js 201903.sqlite
   ```
4. Regenerate all data files:
   ```sh
   php crawler/RegenerateDataFiles.php
   ```

You're done! Thanks for helping Yale students have up-to-date evaluations for course-shopping next semester.
