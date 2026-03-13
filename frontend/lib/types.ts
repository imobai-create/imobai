export type Imovel = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  address: string | null;
  image: string | null;
  userId: number;
  status_diligencia: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Deal = {
  id: number;
  property_id: number;
  buyer_id: number;
  seller_id: number;
  price: number;
  status: string;
};