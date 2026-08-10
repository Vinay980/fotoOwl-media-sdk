import {
  useState,
  type FormEvent,
} from "react";

export interface MediaSearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function MediaSearch({
  initialQuery = "",
  onSearch,
  loading = false,
}: MediaSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    onSearch(normalizedQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 8,
        width: "100%",
      }}
    >
      <input
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        placeholder="Search media..."
        aria-label="Search media"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
        }}
      />

      <button
        type="submit"
        disabled={loading || !query.trim()}
        style={{
          padding: "10px 16px",
          border: 0,
          borderRadius: 8,
          cursor:
            loading || !query.trim()
              ? "not-allowed"
              : "pointer",
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}