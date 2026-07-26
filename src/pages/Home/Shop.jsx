import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, clearProducts } from "../../redux/slices/productSlice";
import { ProductCard } from "../../components/ui/Product-card";
import { SearchAndFilter } from "../../components/ui/Search";
import { ProductSkeleton } from "../../components/ui/cardSkeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export const Shop = () => {
  const dispatch = useDispatch();
  const { pages, loading, total } = useSelector((state) => state.products);

  const [limit] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef(null);

  const page = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(total / limit);

  // Build the cache key matching productSlice format
  const cacheKey = `${page}:${searchQuery}:${category}`;
  const products = pages[cacheKey] || [];

  // Fetch products whenever page, search query, or category changes.
  // Simple and reliable — both fetches in StrictMode write the same data to the same key.
  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search: searchQuery, category }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, category, limit]);


  // On search/category change: reset to page 1 and clear stale cache
  const triggerSearch = useCallback(
    (query, cat) => {
      dispatch(clearProducts());
      setSearchParams({ page: 1 });
      setSearchQuery(query);
      setCategory(cat);
    },
    [dispatch, setSearchParams]
  );

  const handleSearch = useCallback(
    (value) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        triggerSearch(value, category);
      }, 400);
    },
    [category, triggerSearch]
  );

  const handleCategoryChange = useCallback(
    (cat) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      triggerSearch(searchQuery, cat);
    },
    [searchQuery, triggerSearch]
  );

  const changePage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
        <button
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded-full border ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"
          }`}
        >
          ← Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
              className={`px-4 py-2 rounded-full border transition-all ${
                page === pageNumber
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-primary/10"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded-full border ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/10"
          }`}
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <section className="container page mx-auto px-6 py-16">
      <div className="flex flex-col items-center text-center gap-5 mb-5">
        <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-heading mb-4">
          Discover Our <span className="text-primary">Collection</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Explore timeless fragrances crafted with sophistication. Find your
          signature scent from our exclusive lineup.
        </p>
      </div>

      <SearchAndFilter onSearch={handleSearch} onCategoryChange={handleCategoryChange} />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading && !pages[cacheKey] ? (
          Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <EmptyState />
        )}
      </div>

      {!loading && renderPagination()}

      {loading && pages[cacheKey] && (
        <div className="flex justify-center mt-6">
          <p className="text-primary animate-pulse">Loading...</p>
        </div>
      )}
    </section>
  );
};
