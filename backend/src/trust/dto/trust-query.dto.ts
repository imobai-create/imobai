
export class TrustQueryDto {
  document!: string;
  personType!: 'PF' | 'PJ';
  subjectType!: 'OWNER' | 'BUYER' | 'SELLER' | 'PROPERTY';
  propertyId?: number;
  dealId?: number;
}
