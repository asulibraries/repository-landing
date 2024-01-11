# ASU Repositories Landing Page

This repository is an Express.js app to serve as a landing page for https://repository.lib.asu.edu.

It serves five functions:

1. Links KEEP, PRISM, DataVerse.
1. Provide an aggregated search.
1. Redirect from old resources to KEEP and PRISM equivelents. 
1. Display recent items from KEEP.
1. Display a static set of featured items.

Most of this could be done with a static HTML site with some JavaScript; the exception being redirects, of which we have >200k.

# Redirects

The redirects are stored in a sqlite3 database file, `redirects.db`, with the schema `CREATE TABLE redirects (source TEXT PRIMARY KEY, target TEXT NOT NULL);`.
The `source` column stores a the requests' path *without* the leading `/`. The `target` column stores the full target URL.

To load the database manually, install sqlite3, and then run the command `sqlite3 redirects.db < load-redirects.sql`. Building the docker image will do this automatically.
