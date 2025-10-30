import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ui/Product-card";
import { SearchAndFilter } from "../../components/ui/Search";
import { useOutletContext } from "react-router-dom";
import { ProductSkeleton } from "../../components/ui/cardSkeleton";
import { EmptyState } from "../../components/ui/EmptyState";
export const Shop = () => {
  const { data,loading } = useOutletContext();
  const [products, setProducts] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => {
    setProducts(data);
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="container page mx-auto px-6 py-16">
      <div className="flex flex-col  items-center text-center gap-5 mb-5">
        <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-heading mb-4">
          Discover Our <span className="text-primary">Collection</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Explore timeless fragrances crafted with sophistication. Find your
          signature scent from our exclusive lineup.
        </p>
      </div>

      <SearchAndFilter
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Grid */}
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // show 6 skeleton cards
          Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
      <EmptyState/>
        )}
      </div>
    </section>
  );
};
