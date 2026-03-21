function buildPageNumbers(current, total) {
  const maxVisible = 5;
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (end - start < maxVisible - 1) {
    if (start === 1) {
      end = Math.min(total, start + maxVisible - 1);
    } else if (end === total) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = totalPages && totalPages > 0 ? totalPages : 1;
  const safeCurrentPage = currentPage && currentPage > 0 ? currentPage : 1;
  const pages = buildPageNumbers(safeCurrentPage, safeTotalPages);

  if (safeTotalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-3 text-sm font-semibold">
      <nav className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5] disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
        >
          Prev
        </button>

        {pages[0] > 1 && (
          <>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5]"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-2 text-slate-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`rounded-md border px-3 py-2 transition-colors ${
              page === safeCurrentPage
                ? "border-[#1e95b5] bg-[#1e95b5] text-white"
                : "border-slate-200 text-slate-600 hover:border-[#1e95b5] hover:text-[#1e95b5]"
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === safeCurrentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-slate-400">...</span>
            )}
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5]"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="rounded-md border border-slate-200 px-3 py-2 text-slate-600 transition-colors hover:border-[#1e95b5] hover:text-[#1e95b5] disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
