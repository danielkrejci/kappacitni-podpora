import React from 'react'
import { useMemo } from 'react'

export interface PaginationProps {
    /**
     * Custom style on table element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on table element.
     */
    className?: string
    /**
     * Number of total pages.
     */
    totalPages: number
    /**
     * Current page number.
     */
    page: number
    /**
     * Enables next page button.
     */
    hasNext: boolean
    /**
     * Enables previous page button.
     */
    hasPrev: boolean
    /**
     * Handles Next button click.
     */
    onNextClick: () => void
    /**
     * Handles previous button click.
     */
    onPrevClick: () => void
    /**
     * Handles page change.
     */
    onPageChangeClick: (page: number) => void
}

const Pagination = (props: PaginationProps) => {
    const { onPageChangeClick, totalPages, page, hasNext, hasPrev, onNextClick, onPrevClick } = props

    const paginationRange = usePagination({
        currentPage: page,
        totalCount: totalPages * 10,
        siblingCount: 2,
        pageSize: 10,
    })!

    if (page === 0 || paginationRange.length < 2) {
        return null
    }

    return (
        <nav>
            <ul className='pagination'>
                <li className={`page-item${!hasPrev ? ' disabled' : ''}`} onClick={() => (hasPrev ? onPrevClick() : undefined)}>
                    <a href='/' onClick={e => e.preventDefault()} className='page-link'>
                        <i style={{ top: '-1px', position: 'relative', marginRight: '3px' }} className='fa fa-chevron-left' /> Předchozí
                    </a>
                </li>
                {paginationRange.map((pageNumber, idx) => {
                    if (pageNumber === DOTS) {
                        return (
                            <li key={idx} className='page-item dots disabled'>
                                <a href='/' onClick={e => e.preventDefault()} className='page-link'>
                                    ...
                                </a>
                            </li>
                        )
                    }

                    return (
                        <li
                            key={idx}
                            className={`page-item${pageNumber === page ? ' active' : ''}`}
                            onClick={() => onPageChangeClick(Number(pageNumber))}>
                            <a href='/' onClick={e => e.preventDefault()} className='page-link'>
                                {pageNumber}
                            </a>
                        </li>
                    )
                })}
                <li className={`page-item${!hasNext ? ' disabled' : ''}`} onClick={() => (hasNext ? onNextClick() : undefined)}>
                    <a href='/' onClick={e => e.preventDefault()} className='page-link'>
                        Další <i style={{ top: '-1px', position: 'relative', marginLeft: '3px' }} className='fa fa-chevron-right' />
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination

export const DOTS = '...'

const range = (start: number, end: number) => {
    let length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
}

interface usePaginationProps {
    totalCount: number
    pageSize: number
    siblingCount: number
    currentPage: number
}

export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }: usePaginationProps) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize)

        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumbers = siblingCount + 5

        /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount)
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

        /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
        const shouldShowLeftDots = leftSiblingIndex > 2
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

        const firstPageIndex = 1
        const lastPageIndex = totalPageCount

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount
            let leftRange = range(1, leftItemCount)

            return [...leftRange, DOTS, totalPageCount]
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
            return [firstPageIndex, DOTS, ...rightRange]
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex)
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
        }
    }, [totalCount, pageSize, siblingCount, currentPage])

    return paginationRange
}
