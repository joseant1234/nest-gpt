import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';


@Injectable()
export class AssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    private assistantId = process.env.ASSISTANT_ID


    async createThread() {
        return await createThreadUseCase(this.openai);
    }

    async userQuestion(questionDto: QuestionDto) {
        const { threadId, question } = questionDto;
        const message = await createMessageUseCase(this.openai, {threadId, question});
        const run = await createRunUseCase(this.openai, { threadId, assistantId: this.assistantId });
        await checkCompleteStatusUseCase(this.openai, { threadId, runId: run.id });
        // todos los mensajes, incluye los mensajes enviados desde el usario y los de respuesta de openai
        const messages = await getMessageListUseCase(this.openai, { threadId });
        // para cambiar el orden de los mensajes, porque el primer mensaje que se muestra es el ultimo
        return messages.reverse();
    }
}
