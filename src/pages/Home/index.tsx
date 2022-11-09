import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct,updateProductAmount, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  const fetchProducts = async() => {
    const response = await api.get('products')
    const products = response.data
    const formattedProdutcs = products.map((product:ProductFormatted) => {
      const priceFormatted = formatPrice(product.price)
      return {...product,priceFormatted}
    })
  
    setProducts(formattedProdutcs)
  }

  useEffect(() => {
    async function loadProducts() {
      fetchProducts()
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    if(cart.some((product)=> product.id === id)){
      updateProductAmount({productId:id,amount:1})
      return
    }
    addProduct(id)
    return
  }

  return (
    <ProductList>
        {products.map(({id,title,priceFormatted,image}) => {
          return(
            <li key={id}>
            <img src={image} alt="product"/>
            <strong>{title}</strong>
            <span>{priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(id) }
            >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {
              cart.find(product => product.id === id) 
                ? cart[cart.findIndex(product => product.id === id)].amount 
                : 0
            } 
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
          </li>
          )
        })}
    </ProductList>
  );
};

export default Home;
