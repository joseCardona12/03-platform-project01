import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ajusta la ruta según tu estructura

const API_BASE_URL = 'https://communnityvolunteering-production.up.railway.app/api/v1';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = session.user.token;

  try {
    const response = await fetch(`${API_BASE_URL}/projects/report/download`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to download report' },
        { status: response.status }
      );
    }

    const fileBuffer = await response.arrayBuffer();
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="reporte_proyectos.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error downloading report from external API:', error);
    return NextResponse.json(
      { error: 'Error downloading report' },
      { status: 500 }
    );
  }
}