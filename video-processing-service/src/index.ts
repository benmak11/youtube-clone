import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    // Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file paths for either: inputFilePath or outputPathFile");
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // sets video to 360p
        .on("end", () => {
            res.status(200).send("Video processing finished successfully.");
        })
        .on("error", (err) => {
            console.log(`An error has occureed`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`video processing server is running at http://localhost:${port}`);
});
