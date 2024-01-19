import express, { Request, Response } from "express";
import dotenv from "dotenv";
const sqlite3 = require('sqlite3');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static("./public"));
app.use("/theme/asu", express.static("./node_modules/@asu/unity-bootstrap-theme/dist/"));

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
    if (!res.headersSent) {
      console.log(`Not Found: '${fullPath}'`);
      return res.sendStatus(404);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
