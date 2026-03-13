

import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ dealId: string }>;
};

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { dealId } = await params;

    const res = await fetch(`http://localhost:3000/trust-token/${dealId}`, {
      cache: 'no-store',
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Erro ao buscar trust token:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar trust token' },
      { status: 500 },
    );
  }
}

export async function POST(_: NextRequest, { params }: Params) {
  try {
    const { dealId } = await params;

    const res = await fetch(`http://localhost:3000/trust-token/issue/${dealId}`, {
      method: 'POST',
      cache: 'no-store',
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Erro ao emitir trust token:', error);
    return NextResponse.json(
      { error: 'Erro interno ao emitir trust token' },
      { status: 500 },
    );
  }
}