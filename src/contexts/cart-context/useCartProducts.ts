import { useCallback } from 'react';
import { IProduct } from 'models';
import { useCartContext } from './CartContextProvider';
import useCartTotal from './useCartTotal';
import { ICartProduct } from 'models';
import { getProducts } from 'services/products';

const useCartProducts = () => {
  const { products, setProducts } = useCartContext();
  const { updateCartTotal } = useCartTotal();

  const fetchCartProducts = () => {
    getProducts().then((products: IProduct[]) => {
      const iCartProducts = products.map(product => {
        return {...product,quantity:0}
      })
      setProducts(iCartProducts);
    });
  };

  const updateQuantitySafely = (
    currentProduct: ICartProduct,
    targetProduct: ICartProduct,
    quantity: number
  ): ICartProduct => {
    if (currentProduct.id === targetProduct.id) {
      return Object.assign({
        ...currentProduct,
        quantity: currentProduct.quantity + quantity,
      });
    } else {
      return currentProduct;
    }
  };

  const addProduct = (newProduct: ICartProduct) => {
    let updatedProducts;
    const isProductAlreadyInCart = products.some(
      (product: ICartProduct) => newProduct.id === product.id
    );

    if (isProductAlreadyInCart) {
      updatedProducts = products.map((product: ICartProduct) => {
        return updateQuantitySafely(product, newProduct, newProduct.quantity);
      });
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const removeProduct = (productToRemove: ICartProduct) => {
    const updatedProducts = products.filter(
      (product: ICartProduct) => product.id !== productToRemove.id
    );

    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const increaseProductQuantity = (productToIncrease: ICartProduct) => {
    const updatedProducts = products.map((product: ICartProduct) => {
      return updateQuantitySafely(product, productToIncrease, +1);
    });

    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  const decreaseProductQuantity = (productToDecrease: ICartProduct) => {
    const updatedProducts = products.map((product: ICartProduct) => {
      return updateQuantitySafely(product, productToDecrease, -1);
    });

    setProducts(updatedProducts);
    updateCartTotal(updatedProducts);
  };

  return {
    products,
    addProduct,
    removeProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
    fetchCartProducts,
  };
};

export default useCartProducts;
