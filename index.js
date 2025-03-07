const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const { log } = require("console");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    fs.readdir(`./files` , function(err,files){
        res.render("index",{files:files});
    });
});

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ') .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}.txt`,req.body.details , function(err){
        res.redirect("/")
    })
});

app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}` , "utf-8", function(err,filedata){
       res.render("show.ejs",{filename:req.params.filename , filedata:filedata});
    });
});

// app.get("/edit/:filename",(req,res)=>{
//     res.render('edit',{filename:req.params.filename});
// });

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading file");
        }
        res.render("edit", { filename: req.params.filename, filedata });
    });
});

// app.post("/edit",(req,res)=>{
//     fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, function(err){
//         res.redirect("/");
//     })
// });

app.post("/edit", (req, res) => {
    const { previous, new: newFilename, content, username } = req.body;
    const oldPath = `./files/${previous}`;
    const newPath = `./files/${newFilename || previous}`;

    // Rename file if needed
    fs.rename(oldPath, newPath, (err) => {
        if (err && previous !== newFilename) {
            console.error(err);
            return res.status(500).send("Error renaming file");
        }

        // Write new content
        fs.writeFile(newPath, updatedContent, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error updating file content");
            }
            res.redirect("/");
        });
    });
});


app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting file");
        }
        res.redirect("/");
    });
});

app.listen(3000);