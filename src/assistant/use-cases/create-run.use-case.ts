import OpenAI from 'openai';

interface Options {
    threadId: string;
    assistantId: string;
}

export const createRunUseCase = async(openai: OpenAI, options: Options) => {
    const { threadId, assistantId } = options;
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        // instructions: 'nuevas instrucciones', //sobreescribe las instrucciones que se definió en el asistente
    });

    return run;
}