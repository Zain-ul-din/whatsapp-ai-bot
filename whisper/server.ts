import express from "express";
import * as dotenv from 'dotenv';
import { spawn } from "child_process";
dotenv.config();

const app = express ();

const whisperExePath = `./whisper/whisper.cpp/main`;

const callExe = ()=> {

    const program  = spawn (whisperExePath);
    
    program.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    program.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    program.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
};

app.get ("/", (req, res)=> {
    callExe ();
    res.send ("hello from whisper");
});

app.listen (process.env.PORT, ()=>{
    console.log ("whisper server is running on port " + process.env.PORT);
});



