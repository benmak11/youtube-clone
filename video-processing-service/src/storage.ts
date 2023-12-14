// 1. GCS file interactions
// 2. Local file interactions
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = "kush-yt-raw-videos";
const processedVideoBucketName = "kush-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/** 
 * Creates the local directories for raw and processed videos
 */
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * 
 * @param rawVideoName - The name of the file to conveter from {@link localRawVideoPath}
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360") // sets video to 360p
            .on("end", () => {
                console.log("Video processing finished successfully.");
                resolve();
            })
            .on("error", (err) => {
                console.log(`An error has occureed.`);
                //console.log(`Internal Server Error: ${err.message}`);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

/**
 * @param fileName - the name of the file from the
 *          {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder
 * @returns A promise that resolves when the file has been downloaded
 */
export async function downloadRawVideo(fileName: string) {

    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}`});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    )
}

/**
 * @param fileName - the name of the file from the
 *          {@link localProcessedVideoPath} bucket into the {@link local}
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });

    console.log(
        `gs://${localProcessedVideoPath}/${fileName} downloaded to ${processedVideoBucketName}/${fileName}.`
    );

    await bucket.file(fileName).makePublic(); // specied that the file is now made public from the CDN bucket
}

/**
 * 
 * @param fileName - the name of the file to delete from the 
 *          {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * 
 * @param fileName - the name of the file to delete from the
 *          {@link localProcessedVideoPath} folder.
 * @returns A promise that reoslves when the file has been deleted.
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * 
 * @param filePath - The path of the file to be delete.
 * @returns A promise that resolves when the file has been stored deleted.
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file at ${filePath}.`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}.`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping the delete.`);
            resolve();
        }
    });
}

/**
 * Ensures a directory exists, creating it if necessary
 * @param dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true}); // recursive: true enables creating nexted directories
        console.log(`Directory created at ${dirPath}`);
    }
}
