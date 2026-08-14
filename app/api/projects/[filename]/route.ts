import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const decodedFilename = decodeURIComponent(filename)

  try {
    if (!decodedFilename || decodedFilename.includes('..') || decodedFilename.includes('/') || decodedFilename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const imagePath = join(process.cwd(), 'private', 'projects', decodedFilename)

    const file = await readFile(imagePath)

    const ext = decodedFilename.split('.').pop()?.toLowerCase()
    const contentType = ext === 'png' ? 'image/png' :
                      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                      ext === 'webp' ? 'image/webp' :
                      ext === 'gif' ? 'image/gif' :
                      ext === 'svg' ? 'image/svg+xml' :
                      'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('Error serving project image:', error)
    console.error('Full path:', join(process.cwd(), 'private', 'projects', decodedFilename))
    return NextResponse.json({ error: 'Image not found', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 404 })
  }
}