import { Search, Filter } from "lucide-react";
import { useState } from "react";

export const SearchAndFilter = ({ onSearch, onCategoryChange }) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Perfume", "Cologne"]; // Match your product data exactly

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    onCategoryChange?.(cat);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-card rounded-3xl border border-border shadow-md py-6 px-6 md:px-10 mb-10 relative z-10">
      {/* Search Bar */}
      <div className="relative w-full md:w-1/2">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for a fragrance..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-bg-alt border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text placeholder:text-text-muted"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-2 text-primary/80">
          <Filter size={18} />
          <span className="font-medium">Filter:</span>
        </div>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-primary text-bg border-primary shadow-md2"
                : "border-border text-text-muted hover:border-primary/50 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
