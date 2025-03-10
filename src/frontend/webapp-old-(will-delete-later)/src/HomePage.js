import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/HomePage.css';

import LoremIpsum from './components/LoremIpsum';
import Hero from './components/Hero';


function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');

  // Get items when the page loads
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/menu/items');
      setMenuItems(response.data);
    } catch (err) {
      console.error('Failed to get items:', err);
      setError('Failed to get items');
    }
  };

  return (
    <div className="homepage-container">
      {
        //<Navbar />}
      }
      {/* <Hero /> */}
      <section className="content-section">
        <section className="ratings">
          <h1>Restaurant dish ratings</h1>
        </section>

        {error && <p className="error">{error}</p>}

        <h2>List of dishes</h2>
        {menuItems.length === 0 ? (
          <p>No dishes yet</p>
        ) : (
          <ul className="menu-items-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> — {item.description} — ¥{parseFloat(item.price).toFixed(2)}
              </li>
            ))}
          </ul>
        )}

        <div>
          <LoremIpsum />
          <LoremIpsum />
          <LoremIpsum />
          <LoremIpsum />
          <LoremIpsum />
          <LoremIpsum />
          <LoremIpsum />
        </div>
      </section>

      


    </div>
  );
}

export default HomePage;
