import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal += product.price * product.amount
        return sumTotal
      }, 0)
    )

  function handleProductIncrement(productId: number) {
    updateProductAmount({productId:productId,amount:1})
  }

  function handleProductDecrement(productId: number) {
    updateProductAmount({productId:productId,amount:-1})
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map(({id,title,price,image,amount}) => {
            return(
              <tr key={id}>
                <td>
                  <img src={image} alt={title}/>
                </td>
                <td>
                  <strong>{title}</strong>
                  <span>{formatPrice(price)}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                    disabled={amount <= 1}
                    onClick={() => handleProductDecrement(id)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                    onClick={() => handleProductIncrement(id)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{formatPrice(price*amount)}</strong>
                </td>
                <td>
                  <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(id)}
                >
                  <MdDelete size={20} />
                  </button>
                </td>
              </tr> 
            )
          })}
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
