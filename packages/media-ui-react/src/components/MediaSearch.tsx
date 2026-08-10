import {
  useState,
  type FormEvent,
} from "react";

export interface MediaSearchProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function MediaSearch({
  initialQuery = "",
  onSearch,
  loading = false,
  className,
  inputClassName,
  buttonClassName,
}: MediaSearchProps) {
  const [query, setQuery] =
    useState(initialQuery);

  const handleSubmit = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const normalizedQuery =
      query.trim();

    if (!normalizedQuery || loading) {
      return;
    }

    onSearch(normalizedQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
    >
      <input
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        placeholder="Search media..."
        aria-label="Search media"
        className={inputClassName}
      />

      <button
        type="submit"
        disabled={
          loading || !query.trim()
        }
        className={buttonClassName}
      >
        {loading
          ? "Searching..."
          : "Search"}
      </button>
    </form>
  );
}