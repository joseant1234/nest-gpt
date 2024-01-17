import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";


interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async(openai: OpenAI, { prompt, voice }: Options) => {

    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        'echo': 'echo',
        'fable': 'fable',
        'onyx': 'onyx',
        'shimer': 'shimer',
    };
    const selectedVoice = voices[voice] || 'nova';
    const folderPath = path.resolve(__dirname, '../../../generated/audios/');
    const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);
    // si no existe algun directorio que los cree
    fs.mkdirSync(folderPath, { recursive: true });

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice,
        input: prompt,
        response_format: 'mp3',
    });

    // buffer es ya el contenido
    const buffer = Buffer.from(await mp3.arrayBuffer());
    // se guarda el archivo el contenido
    fs.writeFileSync(speechFile, buffer);

    return speechFile;
}