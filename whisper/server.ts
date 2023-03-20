import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import { spawn, exec } from "child_process";
import { mkdirSync, unlink, unlinkSync, writeFileSync } from "fs";
import { rmDir } from "./util";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express ();

// middlewares

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// init out dir

const outDir = './whisper/dist'
const outputPromptFile = `${outDir}/output.md`;
const modelPath = `./whisper/whisper.cpp/models/ggml-base.en.bin `;

const initOutDir = ()=> {
    // rmDir (outDir);
    // mkdirSync (outDir);  
    writeFileSync (outputPromptFile, "");
};

initOutDir ();

const whisperExePath = `./whisper/whisper.cpp/main`;

const callExe = (outPutFile: string) => {
    const program = spawn(whisperExePath, 
        [
            '-f', outPutFile,
            '-m', modelPath,
            '-of', outputPromptFile.replace (".md", "")
        ]
    );
    
    program.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
  
    program.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    program.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  
    program.on('exit', (event) => {
      console.log(event);
    });
};

app.post ("/", (req, res)=> {
    //try  
    //{     
        const fileBuffer = req.body.data;
        
        const uid = uuidv4 ();
        const inputFile = `${outDir}/${uid}.ogg`;
        const outputFile = `${outDir}/${uid}.wav`;

        writeFileSync (inputFile, Buffer.from(fileBuffer, "base64")); // write ogg file

        // ffmpeg -i input.mp3 -ar 16000 -ac 1 -c:a pcm_s16le output.wav
        // const ffmpeg = spawn ("ffmpeg", [] 
        //     // [ "-i", `${inputFile}`, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", `${outputFile}`]
        // );

        const ffmpeg = exec (`ffmpeg -i ${inputFile} -ar 16000 -ac 1 -c:a pcm_s16le ${outputFile}`, (err, stdout, stderr)=> {
            if (err) console.log (stderr);
        }); 

        ffmpeg.on ("exit", ()=> {
            console.log ("ffmpeg - Done");
            unlink (inputFile, ()=> {});
            callExe (outputFile);
        });
        
        // ffmpeg.on('close', (code) => {
        //     console.log ("file has been written");
        // });

        // callExe ();
        res.send ("hello from whisper");
    //}
    // catch (err)
    // {
        // console.log ("At Whisper server: ", err);
        // res.send ("An Error occur check console for more info");
    // }
});

app.listen (process.env.PORT, ()=>{
    console.log ("whisper server is running on port " + process.env.PORT);
});



