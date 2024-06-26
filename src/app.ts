import express, { Request, Response } from "express";
import dotenv from "dotenv";
import * as Search from './search';
import { EMPTY } from "sqlite3";
const sqlite3 = require('sqlite3');
var path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.set('view engine', 'pug')

app.use(express.static("./public"));
app.use("/theme/asu", express.static("./node_modules/@asu/unity-bootstrap-theme/dist/"));

app.get("/search/:repo", (req: Request, res: Response) => {

  if (!req.query.q) {
    console.log("No search term provided.", req.query);
    res.send("");
    return;
  }

  Search.search(req.params['repo'], String(req.query['q']))
    .then((search) => {
      if (!search) {
        console.log(`No ${req.params['repo']} search available.`);
        res.send("");
        return;
      }
      res.render('search-results', {
        'search': search
      });
    });
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile("./");
});

app.use((req: Request, res: Response) => {
  let fullPath = (req.baseUrl + req.path).replace(/^\//, '');

  // Lookup the redirect.
  const db = new sqlite3.Database('redirects.db');
  db.prepare('SELECT target FROM redirects WHERE source = ?').get(fullPath, (err, result) => {
    if (result) {
      console.log(`Redirecting: '${fullPath}' to '${result.target}'`);
      return res.redirect(301, result.target);
    }

    // Page not found.
    if (!res.headersSent) {
      console.log(`Not Found: '${fullPath}'`);
      if (req.accepts('html')) {
        return res
          .status(404)
          .sendFile('index.html', { root: path.join(__dirname, '../public'), });
      }
      return res.sendStatus(404);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
