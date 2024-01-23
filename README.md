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

Building the docker image will do this automatically.
To load the database manually, install sqlite3, and then run the command `sqlite3 redirects.db < load-redirects.sql`.

# ASU Unity Bootstrap 5 Access

The site requires ASU's [unity-bootstrap5 theme library](https://unity.web.asu.edu/@asu/unity-bootstrap-theme/index.html?path=/story/get-started-get-started--page) which is in a private repository. You need to request access to the repository and then generate a GitHub token with `write:packages` permissions.

Save the token to your `.bash_rc` file as a `NPM_TOKEN` variable. This will allow you to issue the `npm install` command and access the private repository. To build the docker image, add the `--build-arg NPM_TOKEN=${NPM_TOKEN}` flag to the build command.