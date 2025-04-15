import * as React from 'react';
import { useParams } from "react-router-dom";


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ReviewList } from '@/components/ReviewList';
import { BrainIcon } from 'lucide-react';


const FullMenuItem = () => {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [itemLoading, setItemLoading] = React.useState(true);

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

  const fetchAiSummary = async () => {
    try {
      const response = await fetch(`/api/menu/summary/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok fetching summary");
      }
      const data = await response.text();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching AI summary:", error);
    }
  };

  React.useEffect(() => {
    fetchMenuItem();
    fetchAiSummary();
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
                <p className="text-muted-foreground">{item.description}</p>
                {item.imagePath && (
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                )}
                {item.categories && item.categories.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.categories.map((category) => (
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                          {category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <BrainIcon className="mr-2 text-blue-500" />
                    User Sentiment
                  </h3>
                  {item.rating && (
                    <StarRating rating={item.rating} reviewCount={item.reviewCount} />
                  )}

                  {summary ? (
                    <p className="italic text-gray-700">{summary}</p>
                  ) : (
                    <p className="italic text-gray-500">No user reviews available.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ReviewList menuItemId={id} />
      </div>
    </div>
  );
};

export default FullMenuItem;;