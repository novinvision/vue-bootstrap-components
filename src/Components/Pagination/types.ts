/** Link object as produced by Laravel's paginator (`links` array). */
export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}
