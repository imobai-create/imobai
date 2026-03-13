
import { Injectable } from '@nestjs/common'

@Injectable()
export class RiskEngineService {

calculateScore(data:any){

let score = 100

if(data.active_lawsuits > 3) score -= 30
if(data.tax_debt) score -= 20
if(data.property_penhora) score -= 40
if(data.price_deviation > 30) score -= 10
if(data.owner_age < 21) score -= 5

let riskLevel = "LOW"

if(score < 80) riskLevel = "MEDIUM"
if(score < 60) riskLevel = "HIGH"

return {
score,
riskLevel
}

}

}



