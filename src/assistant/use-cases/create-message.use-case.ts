import OpenAI from 'openai';

interface Options {
    threadId: string;
    question: string;
}

// crea el mensaje en el thread
export const createMessageUseCase = async(openai: OpenAI, options: Options) => {
    const { threadId, question } = options;
    // el role es 'user' porque se quiere poner como si fuera una pregunta hecha por el usuario
    const message = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: question,
    });

    return message;
}