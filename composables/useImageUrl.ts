/**
 * composables/useImageUrl.ts
 *
 * Builds image URL through the Nuxt server proxy (/api/img).
 * Private S3 buckets are supported — credentials never reach the client.
 */
export function useImageUrl() {
  function imageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    return `/api/img?path=${encodeURIComponent(path)}`
  }

  return { imageUrl }
}
