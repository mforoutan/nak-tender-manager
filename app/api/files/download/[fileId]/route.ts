import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  let connection;
  try {
    const fileId = params.fileId;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    connection = await getConnection();

    const result = await connection.execute(
      `SELECT FILE_CONTENT, ORIGINAL_NAME, MIME_TYPE 
       FROM FILE_STORE 
       WHERE ID = :fileId AND ENTITY_TYPE != 'DELETED'`,
      { fileId }
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const file = result.rows[0];
    const fileContent = file.FILE_CONTENT;
    const originalName = file.ORIGINAL_NAME || 'download';
    const mimeType = file.MIME_TYPE || 'application/octet-stream';

    // Convert BLOB to Buffer
    let buffer: Buffer;
    if (Buffer.isBuffer(fileContent)) {
      buffer = fileContent;
    } else if (fileContent instanceof Uint8Array) {
      buffer = Buffer.from(fileContent);
    } else {
      return NextResponse.json(
        { error: 'Invalid file content' },
        { status: 500 }
      );
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(originalName)}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}
