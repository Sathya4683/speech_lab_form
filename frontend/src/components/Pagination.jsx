const PAGE_SIZE = 10

export default function Pagination({ page, setPage, total }) {
  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <select value={page} onChange={e => setPage(Number(e.target.value))}>
      {Array.from({ length: pages }, (_, i) => (
        <option key={i+1} value={i+1}>
          {i*10+1} – {Math.min((i+1)*10, total)}
        </option>
      ))}
    </select>
  )
}
