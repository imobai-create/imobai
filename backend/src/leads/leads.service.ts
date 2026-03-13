

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lead, LeadStatus } from './lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
  ) {}

  // CREATE
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    try {
      if (!createLeadDto.name) {
        throw new BadRequestException('Name is required');
      }

      if (!createLeadDto.email) {
        throw new BadRequestException('Email is required');
      }

      const lead = this.leadsRepository.create({
        ...createLeadDto,
        status: LeadStatus.NEW,
      });

      return await this.leadsRepository.save(lead);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating lead');
    }
  }

  // FIND ALL
  async findAll(): Promise<Lead[]> {
    try {
      return await this.leadsRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching leads');
    }
  }

  // FIND ONE
  async findOne(id: number): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    return lead;
  }

  // UPDATE STATUS
  async updateStatus(id: number, status: LeadStatus): Promise<Lead> {
    try {
      const lead = await this.findOne(id);

      lead.status = status;

      return await this.leadsRepository.save(lead);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating lead status');
    }
  }

  // DELETE
  async remove(id: number): Promise<{ message: string }> {
    try {
      const lead = await this.findOne(id);

      await this.leadsRepository.remove(lead);

      return {
        message: `Lead ${id} deleted successfully`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting lead');
    }
  }
}

