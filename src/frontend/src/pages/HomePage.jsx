import '@/css/HomePage.scss';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { AlertCircle, Menu, ChevronRight, ShoppingCart as ShoppingCartIcon, Trash2 } from 'lucide-react';
import { MenuItemCard } from '@/components/MenuItemCard';
import React, { useEffect, useState } from 'react';
import '../css/Cart.scss';

function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("Burgers");
  const [carouselApi, setCarouselApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [tipPercentage, setTipPercentage] = useState(null);
  const [customTip, setCustomTip] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu/categories?includeMenuItems=true');
        if (!response.ok) throw new Error('Network response was not ok');
        setData(await response.json());
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    };
    carouselApi.on("select", onSelect);
    setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (tipPercentage !== null && tipPercentage !== 'custom') {
      setTipAmount((totalPrice * tipPercentage) / 100);
    } else if (tipPercentage === 'custom') {
      const parsed = parseFloat(customTip);
      if (!isNaN(parsed)) setTipAmount((totalPrice * parsed) / 100);
      else setTipAmount(0);
    }
  }, [tipPercentage, customTip, totalPrice]);

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleTipSelect = (percentage) => {
    setTipPercentage(percentage);
  };

  const handleCustomTipChange = (e) => {
    setCustomTip(e.target.value);
    setTipPercentage('custom');
  };

  const handleAddToCart = (item, quantity) => {
    setCartItems(prev => {
      const exists = prev.find(cartItem => cartItem.id === item.id);
      if (exists) return prev.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem);
      return [...prev, { ...item, quantity }];
    });
  };

  const featuredItems = React.useMemo(() => data.filter(item => item.featured), [data]);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fetch Error</AlertTitle>
        <AlertDescription>Could not fetch menu items. Is the backend running?</AlertDescription>
      </Alert>
    </div>
  );

  if (loading) return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="sticky top-0 bg-white pb-4 z-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
      </div>
      <Skeleton className="h-80 w-full mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="sticky top-0 pb-4 z-10">
        <div className="flex justify-between items-center mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="py-4">
                <h2 className="text-xl font-bold mb-4">Menu Sections</h2>
                <nav className="space-y-2">
                  {data.map(section => (
                    <Button key={section.id} variant="ghost" className="w-full justify-start" onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      {section.name}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex justify-between items-center">
          <Tabs defaultValue={activeSection} onValueChange={setActiveSection} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max h-11 items-center justify-start bg-muted p-1 mb-4">
                {data.map(section => (
                  <TabsTrigger key={section.id} value={section.id} className="px-4 py-2" onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}>
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </Tabs>
          <div className="mr-4">
            <Button onClick={() => setCartOpen(true)}>
              <ShoppingCartIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Separator className="ml-4 flex-1" />
        </div>
        <Carousel setApi={setCarouselApi} className="w-full" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {featuredItems.map(item => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <MenuItemCard item={item} onAddToCart={handleAddToCart} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end mt-2 gap-2">
            <span className="text-sm text-gray-500">{currentSlide} / {featuredItems.length}</span>
            <CarouselPrevious className="static translate-y-0 mr-1" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
      {data.map(section => (
        <div key={section.id} id={section.id} className="mb-10 scroll-mt-24">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold">{section.name}</h2>
            <Separator className="ml-4 flex-1" />
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4">
            <div className="flex space-x-4 sm:space-x-6 pb-2 pr-4">
              {section.menuItems.map(item => (
                <div key={item.id} className="w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] flex-none">
                  <MenuItemCard item={item} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {cartOpen && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="cart-page bg-white p-6 rounded-md w-full max-w-5xl">
            <div className="flex justify-end">
              <Button variant="outline" size="icon" onClick={() => setCartOpen(false)}>X</Button>
            </div>
            <div className="cart-container">
              <div className="cart-preview">
                <h2>Preview</h2>
                <ScrollArea className="preview-scroll">
                  {cartItems.length === 0 ? (
                    <p>Cart was Empty</p>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.imagePath} alt={item.name} className="cart-item-image" />
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
                <div className="tip-calculator">
                  <h3>Tip Calculator</h3>
                  <div className="tip-options">
                    <Button variant={tipPercentage === 15 ? "secondary" : "outline"} onClick={() => handleTipSelect(15)}>15%</Button>
                    <Button variant={tipPercentage === 20 ? "secondary" : "outline"} onClick={() => handleTipSelect(20)}>20%</Button>
                    <Button variant={tipPercentage === 25 ? "secondary" : "outline"} onClick={() => handleTipSelect(25)}>25%</Button>
                    <Button variant={tipPercentage === 'custom' ? "secondary" : "outline"} onClick={() => handleTipSelect('custom')}>Customize</Button>
                  </div>
                  {tipPercentage === 'custom' && (
                    <div className="custom-tip-input">
                      <input type="number" placeholder="Enter the tip percentage" value={customTip} onChange={handleCustomTipChange} />
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
        </div>
      )}
    </div>
  );
}

export default HomePage;
