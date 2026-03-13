import { Body, Controller, Post } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('person')
  async scorePerson(@Body() body: any) {
    return this.scoringService.scorePerson({
      personType: body.personType,
      document: body.document,
      fullName: body.fullName,
    });
  }
}