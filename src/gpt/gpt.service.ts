import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { orthographyCheckUseCase, proConsDiscusserStreamUseCase, proConsDiscusserUseCase } from './use-cases';
import { OrthographyDto, ProConsDiscusserDto } from './dtos';

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

    async proConsDiscusser(
        { prompt }: ProConsDiscusserDto,
    ) {
        return await proConsDiscusserUseCase(this.openia, { prompt })
    }

    async proConsDiscusserStream(
        { prompt }: ProConsDiscusserDto,
    ) {
        return await proConsDiscusserStreamUseCase(this.openia, { prompt })
    }
}
