/**
 * Client-side rules for user avatar uploads.
 *
 * Only PNG for now: the backend accepts PNG, JPEG and WebP, but book export
 * embeds only PNG avatars, so JPEG/WebP would silently disappear from the
 * exported book. When the backend is fixed, add 'image/jpeg' and 'image/webp'
 * here; the file input `accept` and the validation both read from this list.
 */
export const ALLOWED_AVATAR_TYPES: readonly string[] = ['image/png']

/** Same limit as the backend (2 MB) */
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024

/** Value for `<input type="file" accept>` */
export const AVATAR_ACCEPT = ALLOWED_AVATAR_TYPES.join(',')

/** Human-readable formats for messages, e.g. "PNG" or "PNG, JPEG, WEBP" */
export const AVATAR_FORMATS_LABEL = ALLOWED_AVATAR_TYPES
  .map((type) => type.replace('image/', '').toUpperCase())
  .join(', ')

export const MAX_AVATAR_SIZE_LABEL = `${MAX_AVATAR_SIZE_BYTES / (1024 * 1024)} MB`

export type AvatarFileError = 'invalid_type' | 'too_large'

/** Returns why the file cannot be uploaded, or null when it is fine. */
export const validateAvatarFile = (file: File): AvatarFileError | null => {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) return 'invalid_type'
  if (file.size > MAX_AVATAR_SIZE_BYTES) return 'too_large'
  return null
}
