import * as React from 'react';
import { AlertCircle } from 'lucide-react';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { StarRating } from "@/components/StarRating";
import { NewReviewButton } from '@/components/NewReviewButton';






const ReviewList = ({ menuItemId }) => {

  const [reviewsLoading, setReviewsLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [reviewsError, setReviewsError] = React.useState(null);

  const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/menu-item/${menuItemId}`);
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

    React.useEffect(() => {
        fetchReviews();
      }, [menuItemId]);

    if (reviewsLoading) {
      return (
        <div className='col-span-1'>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-4" />
                      </div>
                      <Skeleton className="w-full h-6" />
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      );

    }

    if (reviewsError) return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Review Fetch Error</AlertTitle>
          <AlertDescription>
            Could not fetch reviews.
          </AlertDescription>
        </Alert>
      </div>
    );

  return(
    <div className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle >
            <NewReviewButton menuItemId={menuItemId} />  
          </CardTitle>
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
  );
};

export { ReviewList };