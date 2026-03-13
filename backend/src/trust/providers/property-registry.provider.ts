
import { Injectable } from '@nestjs/common';
import pool from '../../db';

@Injectable()
export class PropertyRegistryProvider {
  async check(propertyId?: number) {
    if (!propertyId) {
      return {
        provider_name: 'PROPERTY_REGISTRY',
        provider_status: 'PARTIAL',
        raw_payload: { propertyId: null },
        normalized_payload: {
          found: false,
          status_diligencia: null,
          risk: 'HIGH',
          details: 'Imóvel não informado para avaliação patrimonial.',
        },
        risk_level: 'HIGH',
        score_impact: 40,
      };
    }

    const res = await pool.query(
      `
      SELECT id, status_diligencia, score, risk_level
      FROM property
      WHERE id = $1
      LIMIT 1
      `,
      [propertyId],
    );

    const property = res.rows[0];

    if (!property) {
      return {
        provider_name: 'PROPERTY_REGISTRY',
        provider_status: 'FAILED',
        raw_payload: { propertyId },
        normalized_payload: {
          found: false,
          risk: 'HIGH',
          details: 'Imóvel não encontrado na base.',
        },
        risk_level: 'HIGH',
        score_impact: 50,
      };
    }

    const pending = (property.status_diligencia || '').toUpperCase() !== 'CONCLUIDA';

    return {
      provider_name: 'PROPERTY_REGISTRY',
      provider_status: 'SUCCESS',
      raw_payload: property,
      normalized_payload: {
        found: true,
        status_diligencia: property.status_diligencia,
        risk: pending ? 'MEDIUM' : 'LOW',
        details: pending
          ? 'Diligência do imóvel ainda não está concluída.'
          : 'Diligência do imóvel concluída.',
      },
      risk_level: pending ? 'MEDIUM' : 'LOW',
      score_impact: pending ? 25 : 5,
    };
  }
}