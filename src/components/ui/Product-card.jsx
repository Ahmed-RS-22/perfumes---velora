import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCart,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import {
  addToFavourites,
  removeFromFavourites,
  fetchFavourites,
} from "../../redux/slices/favouriteSlice";
import { cn } from "@/lib/utils";
import { notify } from "../../utils/notify";
import { useEffect, useState } from "react";

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: cartData, loading: cartLoading } = useSelector(
    (state) => state.cart
  );
  const { data: favourites, loading: favLoading } = useSelector(
    (state) => state.favourites
  );

  const [isInCart, setIsInCart] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [processingCart, setProcessingCart] = useState(false);
  const [processingFav, setProcessingFav] = useState(false);

  // ✅ Load user's cart & favourites once
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.id));
      dispatch(fetchFavourites(user.id));
    }
  }, [user, dispatch]);

  // ✅ Sync UI with store
  useEffect(() => {
    if (cartData && product) {
      setIsInCart(cartData.some((item) => item.product_id === product.id));
    }
    if (favourites && product) {
      setIsFavourite(favourites.some((item) => item.product_id === product.id));
    }
  }, [cartData, favourites, product]);

  // ✅ Handle Cart Add/Remove
  const handleCartToggle = async () => {
    if (!user) return notify.error("Please login to manage your cart");
    if (processingCart) return;

    try {
      setProcessingCart(true);

      if (isInCart) {
        // Find the correct cart item by product_id, not id
        const cartItem = cartData.find(
          (item) => item.product_id === product.id
        );
        if (cartItem) {
          await dispatch(removeFromCart(cartItem.id)).unwrap();
        }
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
        ).unwrap();
        notify.success("Item added to cart!");
      }

      // Refresh cart after change
      await dispatch(fetchCart(user.id));
    } catch (err) {
      console.error(err);
      notify.error("Something went wrong while updating the cart.");
    } finally {
      setProcessingCart(false);
    }
  };

  // ✅ Handle Favourite Add/Remove
  const handleFavouriteToggle = async () => {
    if (!user) return notify.error("Please login to manage favourites");
    if (processingFav) return;

    try {
      setProcessingFav(true);

      if (isFavourite) {
        await dispatch(
          removeFromFavourites({ userId: user.id, productId: product.id })
        ).unwrap();
        notify.info("Removed from favourites");
      } else {
        await dispatch(
          addToFavourites({ userId: user.id, productId: product.id })
        ).unwrap();
        notify.success("Added to favourites!");
      }

      // Refresh favourites
      await dispatch(fetchFavourites(user.id));
    } catch (err) {
      console.error(err);
      notify.error("Error updating favourites");
    } finally {
      setProcessingFav(false);
    }
  };

  return (
    <div
      key={product.id}
      className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-md2 hover:shadow-lg2 transition-all duration-500 hover:-translate-y-2"
    >
      {/* 🖼 Product Image */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={product?.image_url || "/20.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* ❤️ Favourite Icon */}
        <button
          disabled={favLoading || processingFav}
          onClick={handleFavouriteToggle}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full bg-card/90 backdrop-blur-sm transition-all duration-300",
            isFavourite
              ? "text-error bg-error-bg hover:bg-error hover:text-bg"
              : "text-primary hover:bg-primary hover:text-bg",
            (favLoading || processingFav) && "opacity-70 cursor-not-allowed"
          )}
        >
          <Heart
            size={20}
            fill={isFavourite ? "currentColor" : "none"}
            strokeWidth={isFavourite ? 0 : 2}
          />
        </button>
      </div>

      {/* 🧾 Product Info */}
      <div className="p-6 text-center">
        <p className="text-sm uppercase tracking-widest text-primary/70 mb-1">
          {product.category}
        </p>

        <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex justify-center items-center gap-4 mb-4">
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

        {/* 🛒 Buttons */}
        <div className="flex items-center flex-wrap justify-center gap-3">
          <button
            onClick={handleCartToggle}
            disabled={product.quantity === 0 || processingCart}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-bg transition-all duration-300",
              product.quantity === 0 && "opacity-50 cursor-not-allowed",
              isInCart
                ? "bg-error/90 hover:bg-error"
                : "bg-primary hover:bg-primary/80",
              processingCart && "opacity-70 cursor-wait"
            )}
          >
            <ShoppingCart size={18} />
            {processingCart
              ? "Processing..."
              : isInCart
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
