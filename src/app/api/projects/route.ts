import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

const API_BASE_URL = 'https://communnityvolunteering-production.up.railway.app/api/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1'; 

  try {
    const response = await fetch(`${API_BASE_URL}/projects?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch projects from external API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from external API:', error);
    return NextResponse.json(
      { error: 'Error fetching data from external API' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions); 

  if (!session || !session.user || !session.user.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = session.user.token;
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating project on external API:', error);
    return NextResponse.json(
      { error: 'Error creating project on external API' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = session.user.token;
  const body = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Error updating project on external API' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = session.user.token;

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Error deleting project on external API' },
      { status: 500 }
    );
  }
}
