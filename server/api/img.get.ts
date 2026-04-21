/**
 * GET /api/img?path=documents/eqm-local/img/...
 *
 * Proxies private S3 objects through the Nuxt server.
 * AWS credentials stay server-side — never exposed to the browser.
 */
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Readable } from 'node:stream'

let _client: S3Client | null = null

function getS3Client(): S3Client {
  if (_client) return _client
  _client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  })
  return _client
}

export default defineEventHandler(async (event) => {
  const { path } = getQuery(event)

  if (!path || typeof path !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing path param' })
  }

  const bucket = process.env.AWS_BUCKET
  if (!bucket) {
    throw createError({ statusCode: 500, message: 'AWS_BUCKET not configured' })
  }

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: path })
    const response = await getS3Client().send(command)

    // Cache 1 hour in browser, 10 min in CDN/proxy
    setResponseHeader(event, 'Content-Type', response.ContentType ?? 'image/jpeg')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=600')
    if (response.ContentLength) {
      setResponseHeader(event, 'Content-Length', String(response.ContentLength))
    }

    // AWS SDK v3 returns Node.js Readable in server environment
    const body = response.Body
    if (body instanceof Readable) {
      return sendStream(event, body)
    }

    // Fallback: SdkStream with transformToByteArray
    const bytes = await (body as any).transformToByteArray()
    return new Uint8Array(bytes)
  } catch (err: any) {
    const status = err?.['$metadata']?.httpStatusCode ?? 500
    throw createError({ statusCode: status, message: `S3 error: ${err?.message ?? 'unknown'}` })
  }
})
