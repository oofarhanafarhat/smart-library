import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data');

  if (!data) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const qr = await QRCode.toDataURL(data); // base64 PNG
    return NextResponse.json({ qr });
  } catch (err) {
    console.error('QR generation error:', err);
    return NextResponse.json({ error: 'QR generation failed' }, { status: 500 });
  }
}
