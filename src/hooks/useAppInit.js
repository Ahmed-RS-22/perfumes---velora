import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, listenToAuthChanges } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchFavourites } from "../redux/slices/favouriteSlice";

export function useAppInit() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
      dispatch(fetchFavourites(userId));
    }
  }, [dispatch, userId]);
}
