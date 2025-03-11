import { useState, useEffect } from 'react'
import '@/css/HomePage.scss'

import { Button } from "@/components/ui/Button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Menu } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

import { LoremIpsum } from "@/components/LoremIpsum"
import { MenuItem } from '@/components/MenuItem'
import { NavBar } from '@/components/NavBar'

import spaghetti from '@/media/spaghetti-temp.jpg'
import missingIcon from '@/media/question-missing.jpg';


function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuSectionList = ["Burgers", "Sushi", "Pizza", "Drinks", "Salads", "Pasta", "Dessert"]
  

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
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fetch Error</AlertTitle>
        <AlertDescription>
          Could not fetch menu items. Is the backend running?
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="homepage-container">
      <div className='sticky top-0 nav-bar'>
        <NavBar menuSections={menuSectionList}/>
      </div>
      <h1 className="text-4xl mb-4">Menu Items</h1>
      <Separator className="my-2"/> 
      {menuSectionList.map((section) => (
        // add key
        <div id={section} className='scroll-wrapper' key={section}> 
          <h2 className="text-4xl section-title scroll-mt-8 mt-4 mb-2">{section}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          </div>
          <Separator className='my-2'/>
        </div>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <MenuItem 
            key={item.id}
            title={item.name}
            description={item.description}
            rating={Math.floor((Math.random() * 11)) / 2}
            price={item.price}
            image={item.imagePath ? `http://localhost:8080${item.imagePath}` : missingIcon}
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