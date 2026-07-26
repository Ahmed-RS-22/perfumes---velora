import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchFavourites,
  removeFromFavourites,
} from "../../redux/slices/favouriteSlice";
import { addToCart, removeFromCart, fetchCart } from "../../redux/slices/cartSlice";

export const Favourites = () => {
  const { user } = useSelector((state) => state.auth);
  // favData items already contain joined `products` from Supabase select
  const { data: favData, loading } = useSelector((state) => state.favourites);
  const { data: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Track which product IDs are currently processing (cart toggle)
  const [processingIds, setProcessingIds] = useState(new Set());

  // Fetch favourites & cart on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFavourites(user.id));
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  // Derive full product objects from the joined favourites data
  const favItems = favData
    .map((fav) => fav.products)
    .filter(Boolean);

  // Remove from favourites
  const handleRemoveFromFav = useCallback(
    async (product) => {
      if (!user) return;
      await dispatch(removeFromFavourites({ userId: user.id, productId: product.id }));
    },
    [dispatch, user]
  );

  // Toggle cart membership
  const handleCartAction = useCallback(
    async (product) => {
      if (!user) return;
      setProcessingIds((prev) => new Set(prev).add(product.id));
      try {
        const inCart = cartItems?.some((c) => c.product_id === product.id);
        if (inCart) {
          const cartItem = cartItems.find((c) => c.product_id === product.id);
          if (cartItem) await dispatch(removeFromCart(cartItem.id));
        } else {
          await dispatch(
            addToCart({
              userId: user.id,
              productId: product.id,
              quantity: 1,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            })
          );
        }
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }
    },
    [dispatch, user, cartItems]
  );

  return (
    <section className="container page mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-5 mb-12">
        <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-heading">
          Your <span className="text-primary">Favourites</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Manage your saved perfumes or move them to your shopping cart.
        </p>
      </div>

      {/* Loading */}
      {loading && favItems.length === 0 && (
        <div className="text-center py-20 text-text-muted animate-pulse">
          Loading your favourites...
        </div>
      )}

      {/* Empty State */}
      {!loading && favItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="relative">
            <Heart
              size={70}
              className="mx-auto text-primary animate-pulse drop-shadow-[0_0_10px_rgba(198,167,118,0.4)]"
            />
            <div className="absolute inset-0 rounded-full blur-xl bg-primary/20" />
          </div>
          <p className="mt-8 text-text-muted text-lg">
            You haven't added any favourites yet.
          </p>
          <Link
            to="/Shop"
            className="mt-5 inline-block px-6 py-3 bg-primary text-bg rounded-full font-medium hover:bg-primary/80 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Favourites Grid */}
      {favItems.length > 0 && (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {favItems.map((product) => {
            const inCart = cartItems?.some((item) => item.product_id === product.id);
            const isProcessing = processingIds.has(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-gradient-to-b from-bg/80 to-bg/90 border border-border/70 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative w-full h-72 overflow-hidden">
                  <img
                    src={product?.image_url || "/20.jpg"}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

                  {/* Remove Favourite */}
                  <button
                    disabled={loading}
                    onClick={() => handleRemoveFromFav(product)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-bg/70 backdrop-blur-sm text-error hover:bg-error hover:text-bg transition-all duration-300"
                    title="Remove from favourites"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6 text-center">
                  <p className="text-sm uppercase tracking-widest text-primary/70 mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-semibold text-heading mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex justify-center items-center gap-4 mb-5">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        product.quantity > 0 ? "text-success" : "text-error"
                      }`}
                    >
                      {product.quantity > 0
                        ? `${product.quantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* Cart Action */}
                  <button
                    onClick={() => handleCartAction(product)}
                    disabled={product.quantity === 0 || isProcessing}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-full text-bg font-medium transition-all duration-300 ${
                      inCart
                        ? "bg-error/90 hover:bg-error"
                        : "bg-primary hover:bg-primary/80"
                    } ${
                      product.quantity === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "shadow-[0_0_15px_rgba(198,167,118,0.3)] hover:shadow-[0_0_20px_rgba(198,167,118,0.5)]"
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {isProcessing
                      ? "Processing..."
                      : inCart
                      ? "Remove from Cart"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
