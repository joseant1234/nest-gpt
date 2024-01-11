import OpenAI from "openai";

interface Options {
    prompt: string;

}
// tambien se puede mandar el dto, pero usualemnte recibe como parametro lo que exactamente necesita para funcionar
export const orthographyCheckUseCase = async(openai: OpenAI, options: Options) => {
    const { prompt } = options;
    // role system es el rol que openai va tomar, si el role es system será un asistente
    // content son las indicaciones inciales que se le está ajustando. Por ejemplo: content: content: "Eres un buen asistente, debes responder amablementey dar tu nombre"
    // la prop max_tokens a mas se ponga mas consume la cuota. Sirve para liminar cantidad máxima de tokens (palabras o caracteres) en la respuesta generada. OpenAI truncará automáticamente el texto para que no supere ese límite
    // la prop temperature sirve para ver los resultados random, a mas alto sea mas aleatorio, mas cercano al cero es mas deterministico
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                    Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
                    Las palabras usadas deben existir en el diccionario de la Real Academia Española,
                    Debes de responder en formato JSON,
                    tu tarea es corregirlos y retornar información soluciones,
                    también debes de dar un porcentaje de acierto por el usuario,



                    Si no hay errores, debes de retornar un mensaje de felicitaciones.

                    Ejemplo de salida:
                    {
                        userScore: number,
                        errors: string[], // ['error -> solución']
                        message: string, // Usa emojis y texto para felicitar al usuario
                    }


                `
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 150,
        response_format: { // no todos los modelos soportan json_object, el gpt-3.5-turbo-1106 si soporta, gp-4 no soporta
            type: 'json_object',
        }
    });

    const jsonResp = JSON.parse(completion.choices[0].message.content);

    return jsonResp;
}