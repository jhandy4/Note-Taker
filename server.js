var express = require("express");
var path = require("path");
var fs = require("fs");
var PORT = process.env.PORT || 3500;
let notes = require("./db/db.json");

var app = express();
// Sets up the express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// * The following HTML routes should be created:
//   * GET `/notes` - Should return the `notes.html` file.
//   * GET `*` - Should return the `index.html` file
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function(req, res) {
    res.send(path.join(__dirname, "/public/index.html"));
});
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
// app.get("/api/notes", function(req, res) {
//     return res.sendFile(path.json(__dirname, "/db/db.json"));
// });

// let notes = [];

app.get("/api/notes/", function (err,res) {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function (err) {
        if (err) throw err;
    });
    res.send(JSON.parse(notes));
    res.json(notes);
});


//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.post("/api/notes", function(req,res) {
    notes = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    notes = JSON.parse(notes);
    req.body.id = notes.length +1;
    notes.push(req.body);
    notes = JSON.stringify(notes);
    fs.writeFile(path.join(__dirname, "/db/db.json"), notes, "utf8", function(err) {
        if (err) throw err;
    });
    res.json(JSON.parse(notes));
});

app.delete("/api/notes/:id", function(req,res) {
    notes = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    notes = JSON.parse(notes);
    notes = notes.filter(function(note) {
      return note.id != req.params.id;
    });
    notes = JSON.stringify(notes);
    fs.writeFile(path.join(__dirname, "/db/db.json"), notes, "utf8", function(err) {
    if (err) throw err;
    });
    res.send(JSON.parse(notes));
});


app.listen(PORT, () => {
  console.log(`Server is listening port: ${PORT}`);
});


