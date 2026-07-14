export type Pagination=
{
    currentPage:number,
    pageSize:number,
    totalPages:number,
    totalCount:number
}
export type PaginationResult<T>=
{
    items:T[],
    paginatedMetaData:Pagination

}