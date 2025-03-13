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
import { AlertCircle, Menu, ChevronRight } from 'lucide-react';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ShoppingCartIcon } from 'lucide-react';
import { Link } from 'react-router';

import * as React from 'react';

function HomePage() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activeSection, setActiveSection] = React.useState("Burgers");
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    // Fetch menu items when component mounts
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu/categories?includeMenuItems=true');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setData(await response.json());
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  React.useEffect(() => {
    // Setup carousel event listener
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    };

    carouselApi.on("select", onSelect);
    setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const featuredItems = React.useMemo(() => {
    return data.filter((item) => item.featured);
  }, [data]);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fetch Error</AlertTitle>
        <AlertDescription>
          Could not fetch menu items. Is the backend running?
        </AlertDescription>
      </Alert>
    </div>
  );

  if (loading) {
    return (
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
  }

  return (
    <div>
      <div className="sticky top-0 bg-white pb-4 z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CS 1530 Group 11</h1>
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
                  {data.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {section.name}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className='flex justify-between items-center'>
          <Tabs defaultValue={activeSection} onValueChange={setActiveSection} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max h-11 items-center justify-start bg-muted p-1 mb-4">
                {data.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="px-4 py-2"
                    onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </Tabs>

          <Link to="/cart">
            <Button>
              <ShoppingCartIcon className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Separator className="ml-4 flex-1" />
        </div>

        <Carousel
          setApi={setCarouselApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {featuredItems.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <MenuItemCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end mt-2 gap-2">
            <span className="text-sm text-gray-500">
              {currentSlide} / {featuredItems.length}
            </span>
            <CarouselPrevious className="static translate-y-0 mr-1" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>

      {data.map((section) => (
        <div key={section.id} id={section.id} className="mb-10 scroll-mt-24">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold">{section.name}</h2>
            <Separator className="ml-4 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* If we have items for this section, show them */}
            {section.menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;