//Componente da paginação
export default function Pagination({
  paginationControl,
  currentPage,
  onChangePage,
}) {
  return (
    <nav>
      <ul className="pagination pagination-sm justify-content-center">
        {Array.from({ length: paginationControl }, (_, i) => (
          <li
            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            key={i + 1}
            onClick={() => onChangePage(i + 1)}
          >
            <a className="page-link">{i + 1}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
