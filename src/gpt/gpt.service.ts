import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';

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
}
