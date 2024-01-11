DROP TABLE IF EXISTS redirects;
CREATE TABLE redirects (source TEXT PRIMARY KEY, target TEXT NOT NULL);
.mode tabs 
.import redirects.csv redirects