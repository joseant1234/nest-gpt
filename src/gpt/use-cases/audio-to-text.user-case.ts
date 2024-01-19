import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";


interface Options {
    prompt?: string;
    audioFile: Express.Multer.File
}

export const audioToTextUseCase = async(openai: OpenAI, { prompt, audioFile }: Options) => {
    // audioFile.path es donde esta guardado el file
    const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream(audioFile.path), // file espera un stream
        prompt, // mismo idioma que el audio, se puede poner que deje en texto el 'hmm', 'manten todos los signos de puntuacion'
        language: 'es', // siguiendo ISO-639-1
        // response_format: 'srt',
        // response_format: 'vtt',
        response_format: 'verbose_json',
    });

    return response;
}