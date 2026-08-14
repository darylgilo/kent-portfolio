import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Decode URL-encoded filename (handles spaces and special characters)
  const { filename } = await params
  const decodedFilename = decodeURIComponent(filename)
  
  try {
    // Security: Validate filename to prevent directory traversal
    if (!decodedFilename || decodedFilename.includes('..') || decodedFilename.includes('/') || decodedFilename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    // Path to private certificates folder
    const certificatesPath = join(process.cwd(), 'private', 'certificate', decodedFilename)
    
    // Read the file
    const file = await readFile(certificatesPath)
    
    // Determine content type based on file extension
    const ext = decodedFilename.split('.').pop()?.toLowerCase()
    const contentType = ext === 'png' ? 'image/png' : 
                      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                      ext === 'webp' ? 'image/webp' :
                      ext === 'pdf' ? 'application/pdf' :
                      'application/octet-stream'

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('Error serving certificate:', error)
    console.error('Filename:', decodedFilename)
    console.error('Full path:', join(process.cwd(), 'private', 'certificate', decodedFilename))
    return NextResponse.json({ error: 'Image not found', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 404 })
  }
}
