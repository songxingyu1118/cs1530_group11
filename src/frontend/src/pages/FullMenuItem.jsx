import * as React from 'react';
import { useParams } from "react-router-dom";


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { ReviewList } from '@/components/ReviewList';



const FullMenuItem = () => {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [itemLoading, setItemLoading] = React.useState(true);
  const [summaryLoading, setSummaryLoading] = React.useState(true);

  const fetchMenuItem = async () => {
    try {
      const response = await fetch(`/api/menu/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok fetching items");
      }
      const data = await response.json();
      setItem(data);
      setItemLoading(false);
    } catch (error) {
      setError(error.message);
      setItemLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      const response = await fetch(`/api/menu/summary/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok generating summary");
      }
      const data = await response.text();
      setSummary(data);
      setSummaryLoading(false);
    } catch (error) {
      setError(error.message);
      setSummaryLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchMenuItem();
    generateSummary();
  }, [id]);

  if (itemLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8">Error: {error}</div>;
  }

  if (!item) {
    return <div className="container mx-auto py-8">Item not found!</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className='mb-6'>
        <Button onClick={() => window.history.back()}>
          <ChevronLeft className="mr-1" /> Back to Menu
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Item details */}
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
              <p className="text-lg font-semibold text-green-700">${item.price}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {item.imagePath && (
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <img 
                      src={item.imagePath} 
                      alt={item.name} 
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {item.rating ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rating</h3>
                    <StarRating rating={item.rating} reviewCount={item.reviewCount} />
                  </div>
                ): (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rating</h3>
                    <p className="text-muted-foreground">No ratings yet</p>
                  </div>
                )}
                {summaryLoading && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">User Review Summary</h3> <Sparkles />
                    </div>
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                )}
                {!summaryLoading && summary && summary.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">User Review Summary</h3> <Sparkles />
                    </div>
                    <div>
                      <p className="text-muted-foreground">{summary}</p>
                    </div>
                  </div>
                )}
              </div>
              
              
            </CardContent>
          </Card>
        </div>

        <ReviewList menuItemId={id} />
      </div>
    </div>
  );
};

export default FullMenuItem;