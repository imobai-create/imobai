import {

Controller,

Get,

Post,

Body,

Param,

Patch,

Delete,

ParseIntPipe,

} from '@nestjs/common';

import { LeadsService } from './leads.service';

import { CreateLeadDto } from './dto/create-lead.dto';

import { LeadStatus } from './lead.entity';



@Controller('leads')

export class LeadsController {

constructor(private readonly leadsService: LeadsService) {}



@Post()

create(@Body() createLeadDto: CreateLeadDto) {

return this.leadsService.create(createLeadDto);

}



@Get()

findAll() {

return this.leadsService.findAll();

}



@Patch(':id/status/:status')

updateStatus(

@Param('id', ParseIntPipe) id: number,

@Param('status') status: LeadStatus,

) {

return this.leadsService.updateStatus(id, status);

}



@Delete(':id')

remove(@Param('id', ParseIntPipe) id: number) {

return this.leadsService.remove(id);

}

}

