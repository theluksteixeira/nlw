import express from 'express';

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    console.log('App read!.');
    return res.json([
        "lucas",
        "maria",
        "pedro"
    ]);
})

app.listen(3000, () => {
    console.log("Application Start");
})