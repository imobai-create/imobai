
import { Controller, Post, Body } from '@nestjs/common'
import { RiskEngineService } from './risk-engine.service'

@Controller('risk')
export class RiskEngineController {

constructor(private riskService:RiskEngineService){}

@Post('analyze')
analyze(@Body() body:any){

const result = this.riskService.calculateScore(body)

return result

}

}