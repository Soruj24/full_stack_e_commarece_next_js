import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/config/db';
import { AbandonedCart } from '@/models/AbandonedCart';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const carts = await AbandonedCart.find(query)
      .populate('items.productId', 'name images price')
      .sort({ createdAt: -1 });

    return NextResponse.json(carts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch carts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const cart = await AbandonedCart.create({
      userId: body.userId || session.user.id,
      email: body.email,
      items: body.items,
      totalAmount: body.totalAmount,
      status: 'active',
      expiresAt,
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
  }
}
