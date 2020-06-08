var express = require("express");
var path = require("path");
var fs = require("fs");
var PORT = process.env.PORT || 3000;
var notes = require("./db/db.json");

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
app.get("/api/notes", function(req,res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});
app.get("/api/notes/:id", function (err,res) {
    notes = JSON.parse(fs.readFile(path.join(__dirname, "/db/db.json"), "utf8"), function (err, data) {
        if (err) throw err;
    });
    res.json(notes[Number(req.params.id)]);
    // res.json(data);
});
app.get("*", function(req, res) {
    res.send(path.join(__dirname, "/public/index.html"));
});
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
// app.get("/api/notes", function(req, res) {
//     return res.sendFile(path.json(__dirname, "/db/db.json"));
// });

//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.post("/api/notes", function(req,res) {
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8"));
    // data = JSON.parse(notes);
    newNote = req.body;
    // req.body.id = notes.length +1;
    arrayId = (notes.length).toString();
    newNote.id = arrayId;
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), "utf8", function(err) {
        if (err) throw err;
    });
    res.json(notes);
});

app.delete("/api/notes/:id", function(req,res) {
    notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8"));
    // notes = JSON.parse(notes);
    noteId = req.params.id;
    notes = notes.filter(selectNote => {
        return selectNote.id != noteId;
    });
    // notes = JSON.stringify(notes);
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), "utf8", function(err) {
        if (err) throw err;
    });
    res.json(notes);

});


app.listen(PORT, () => {
  console.log(`Server is listening port: ${PORT}`);
});


