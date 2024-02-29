import * as fs from 'fs';
import * as path from 'path';
import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helper";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async(openai: OpenAI, { prompt, originalImage, maskImage }: Options) => {

    if (!originalImage || !maskImage) {
        const response = await openai.images.generate({
            prompt,
            model: 'dall-e-3',
            n: 1, // dall-e-3' soporta por el momento generar una imagen
            size: '1024x1024', // mas pixeles mas costo tiene
            quality: 'standard',
            response_format: 'url', // se genera una url que va estar en filesystem de openai por una horas
        });

        const fileName = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

        return {
            url, // url que se va usar
            openAIUrl: response.data[0].url, // url de openia
            revised_prompt: response.data[0].revised_prompt,
        };
    }

    // originalImage = http://localhost:3000/gpt/image-generation/<nombre>.png
    // maskImage = Base64;asdadadasd...
    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath  = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1, // numero de resultados
        size: '1024x1024',
        response_format: 'url',
    });
    // response.data[0] si hubiera mas imágenes sería [n]
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url, // url que se va usar
        openAIUrl: response.data[0].url, // url de openia
        revised_prompt: response.data[0].revised_prompt,
    }

}

