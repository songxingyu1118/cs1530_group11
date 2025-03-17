import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/StarRating";
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';



const FullMenuItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  const [itemLoading, setItemLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsError, setReviewsError] = useState(null);

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
  
  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/menu-item/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setReviews(data);
      setReviewsLoading(false);
    } catch (error) {
      setReviewsError(error.message);
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItem();
    fetchReviews();
  }, [id]);

  if (itemLoading || reviewsLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8">Error: {error}</div>;
  }

  if (reviewsError) {
    return <div className="container mx-auto py-8">Error loading reviews: {reviewsError}</div>;
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
                {item.rating && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rating</h3>
                    <StarRating rating={item.rating} reviewCount={item.reviewCount} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <StarRating rating={review.stars} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{review.content}</p>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews available for this item.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FullMenuItem;