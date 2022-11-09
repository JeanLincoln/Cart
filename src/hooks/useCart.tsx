import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const stockResponse = await api.get('stock')
      const productResponse = await api.get('products')

      const productStock = stockResponse.data.find((product:Stock) => product.id === productId)
      const isOutOfStock = productStock.amount === 0 ? true : false
      const productToAdd = productResponse.data.find((product:Product) => productId === product.id)
      if(productToAdd && isOutOfStock){
        toast.error('Quantidade solicitada fora de estoque');
        return 
      }
      productToAdd.amount = 1
      setCart((state) => [...state,productToAdd])
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart))
    } catch ({ name, message }){
      toast.error('Houve um problema ao adicionar o produto');
    }
  };
  
  const removeProduct = (productId: number) => {
    try {
      const cartWithoutTheProduct = cart.filter(product => product.id !== productId)
      setCart([...cartWithoutTheProduct])
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cartWithoutTheProduct))
    } catch {
      toast.error('Houve um problema ao excluir o produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const stockResponse = await api.get('stock')
      const productStock = stockResponse.data.find((product:Stock) => product.id === productId)
      const productToUpdate = cart.findIndex(product => product.id === productId);
      if(amount < 0){
      cart[productToUpdate].amount += amount
      setCart(state => [...state])
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart))
      return 
      }
      if(productStock.amount - cart[productToUpdate].amount === 0){
        toast.error('Quantidade solicitada fora de estoque');
        return 
      }
      cart[productToUpdate].amount += amount
      setCart(state => [...state])
      localStorage.setItem('@RocketShoes:cart',JSON.stringify(cart))
    } catch ({ name, message }){
      toast.error('Houve um problema ao atualizar a quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
