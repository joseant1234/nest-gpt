import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProConsDiscusserDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  // dto envia la info del controlador al servicio
  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pro-cons-discusser')
  proConsDiscusser(
    @Body() proConsDiscusserDto: ProConsDiscusserDto,
  ) {
    return this.gptService.proConsDiscusser(proConsDiscusserDto);
  }

  @Post('pro-cons-discusser-stream')
  async proConsDiscusserStream(
    @Body() proConsDiscusserDto: ProConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.proConsDiscusserStream(proConsDiscusserDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    // como es un stream por eso usa for await, dado que son varias emisiones del stream
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      // escribe el flujo en la respuesta
      res.write(piece);
    }
    // cuando llegue a res.end() significa que termino el stream
    res.end();
  }
}
