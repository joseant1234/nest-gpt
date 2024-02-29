import * as path from 'path';
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Injectable()
export class GptService {

    private openia = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    async orthographyCheck(
        orthographyDto: OrthographyDto,
    ) {
        return await orthographyCheckUseCase(this.openia, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDiscusser(
        { prompt }: ProsConsDiscusserDto,
    ) {
        return await prosConsDiscusserUseCase(this.openia, { prompt })
    }

    async prosConsDiscusserStream(
        { prompt }: ProsConsDiscusserDto,
    ) {
        return await prosConsDiscusserStreamUseCase(this.openia, { prompt })
    }

    async translateText(
        { prompt, lang }: TranslateDto,
    ) {
        return await translateUseCase(this.openia, { prompt, lang })
    }

    async textToAudio(
        { prompt, voice }: TextToAudioDto,
    ) {
        return await textToAudioUseCase(this.openia, { prompt, voice });
    }

    async textToAudioGetter(
        fileId: string,
    ) {
        const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
        const wasFound = fs.existsSync(filePath);
        if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);
        return filePath;
    }

    async audioToText(
        audioFile: Express.Multer.File,
        dto: AudioToTextDto,
    ) {
        const { prompt } = dto;
        return await audioToTextUseCase(this.openia, { audioFile, prompt });
    }

    async imageGeneration(
        imageGenerationDto: ImageGenerationDto
    ) {
        return await imageGenerationUseCase(this.openia, {...imageGenerationDto});
    }

    getGeneratedImage(fileName: string) {
        const filePath = path.resolve('./', './generated/images/', fileName);
        const exists = fs.existsSync(filePath);
        if (!exists) {
            throw new NotFoundException(`File not found`);
        }
        return filePath;
    }

    async generateImageVariation(
        { baseImage }: ImageVariationDto
    ) {
        return imageVariationUseCase(this.openia, { baseImage });
    }

}
