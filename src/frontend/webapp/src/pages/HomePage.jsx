import { useState, useEffect } from 'react'
import '@/css/HomePage.scss'

import { Button } from "@/components/ui/Button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Menu } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

import { LoremIpsum } from "@/components/LoremIpsum"
import { MenuItem } from '@/components/MenuItem'

import spaghetti from '@/media/spaghetti-temp.jpg'


function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch menu items when component mounts
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/menu/items');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <div>Loading menu items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="homepage-container">
      <h1 className="text-4xl mb-4">Menu Items</h1>
      <Separator className="my-2"/> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <MenuItem 
            title={item.name}
            description={item.description}
            rating={Math.floor((Math.random() * 11)) / 2}
            price={item.price}
            image={spaghetti}
          /> 
        ))}
      </div>
      <Separator className="my-6"/>
      <LoremIpsum />
      <LoremIpsum />
      <LoremIpsum />
    </div>
  );
}

export default HomePage;