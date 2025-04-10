import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from 'lucide-react';
import '../css/Cart.scss';

function Cart() {
  // get item data from localStorage
  const [cartItems, setCartItems] = useState([]);
  // tipPercentage
  const [tipPercentage, setTipPercentage] = useState(null);
  const [customTip, setCustomTip] = useState('');
  const [tipAmount, setTipAmount] = useState(0);

  // calculate sum（price、quantity）
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // update localStorage when update cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // remove item
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  // when change tipPercentage or customTip、totalPrice update tipAmount
  useEffect(() => {
    if (tipPercentage !== null && tipPercentage !== 'custom') {
      setTipAmount((totalPrice * tipPercentage) / 100);
    } else if (tipPercentage === 'custom') {
      const parsed = parseFloat(customTip);
      if (!isNaN(parsed)) {
        setTipAmount((totalPrice * parsed) / 100);
      } else {
        setTipAmount(0);
      }
    }
  }, [tipPercentage, customTip, totalPrice]);

  const handleTipSelect = (percentage) => {
    setTipPercentage(percentage);
  };

  const handleCustomTipChange = (e) => {
    setCustomTip(e.target.value);
    setTipPercentage('custom');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* preview */}
        <div className="cart-preview">
          <h2>Preview</h2>
          <ScrollArea className="preview-scroll">
            {cartItems.length === 0 ? (
              <p>Cart was Empty</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>Quantity：{item.quantity}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="total-price">
            <span>Total：</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {/* Tips calculator */}
          <div className="tip-calculator">
            <h3>Tip Calculator</h3>
            <div className="tip-options">
              <Button
                variant={tipPercentage === 15 ? "secondary" : "outline"}
                onClick={() => handleTipSelect(15)}
              >
                15%
              </Button>
              <Button
                variant={tipPercentage === 20 ? "secondary" : "outline"}
                onClick={() => handleTipSelect(20)}
              >
                20%
              </Button>
              <Button
                variant={tipPercentage === 25 ? "secondary" : "outline"}
                onClick={() => handleTipSelect(25)}
              >
                25%
              </Button>
              <Button
                variant={tipPercentage === 'custom' ? "secondary" : "outline"}
                onClick={() => handleTipSelect('custom')}
              >
                Customize
              </Button>
            </div>
            {tipPercentage === 'custom' && (
              <div className="custom-tip-input">
                <input
                  type="number"
                  placeholder="Enter the tip percentage"
                  value={customTip}
                  onChange={handleCustomTipChange}
                />
              </div>
            )}
            <div className="calculated-tip">
              <span>Amount of tip：</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
