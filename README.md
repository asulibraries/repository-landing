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

The site requires ASU's [unity-bootstrap5 theme library](https://asu.github.io/asu-unity-stack/@asu/unity-bootstrap-theme/index.html?path=/docs/get-started-get-started--docs) which is in a private repository. You need to request access to the repository and then generate a GitHub token with `write:packages` permissions and then login to npm: `npm login --registry=https://npm.pkg.github.com --scope=@asu` (username is your GitHub username and password is the token you just created).

# Building and Deploying

## Build and Run Locally

```
# Install needed libraries. (Only needs to be run the first time.)
npm install

# Build and run.
npm run build; npm run dev

# Open browser to localhost:8000
```

## Build and Run on Docker

```
docker build -t repo-landing --secret id=npmrc,src=$HOME/.npmrc .
docker run --name repository-landing -d -p 8030:8000 repo-landing:latest

# Open browser to localhost:8030
```

## AWS
```
# WSL2 doesn't like the VPN when building, so disconnect it.
ddocker build -t repo-landing --secret id=npmrc,src=$HOME/.npmrc .

# Get the AWS ECR identifier from the console.
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin XXXXX.dkr.ecr.us-west-2.amazonaws.com
docker tag repo-landing:latest XXXXX.dkr.ecr.us-west-2.amazonaws.com/repo-landing:latest
docker push XXXXX.dkr.ecr.us-west-2.amazonaws.com/repo-landing:latest

# Redeploy the service with the new image on the repository landing ECS cluster
aws ecs update-service --cluster repo-landing-prod --service repo-landing-prod-service --force-new-deployment
```
