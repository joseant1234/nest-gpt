import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';

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
}
