import * as React from 'react';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { encrypt, decrypt, getSessionId } from '@/security/ecdhclient';
import { useNavigate } from 'react-router-dom';

import eventBus from '@/utils/eventBus';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Star, LogIn } from 'lucide-react';

// Zod form schema
const formSchema = z.object({
  stars: z.number()
    .min(2, "Rating must be at least 1 star")
    .max(10, "Rating cannot exceed 5 stars"), // I have no clue how this could possibly display but its here just in case
  content: z.string()
    .min(1, "Review cannot be empty")
    .max(500, "Review cannot exceed 500 characters"),
});

const NewReviewButton = ({ menuItemId }) => {
  const [open, setOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Define form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stars: 0,
      content: "",
    },
  });

  // Redirect to login page
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Handle form submission
  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');

      // If not logged in, redirect to login
      if (!token) {
        setOpen(false);
        handleLoginRedirect();
        return;
      }

      // Create the review data object
      const reviewData = {
        stars: values.stars,
        content: values.content,
        menuItemId: menuItemId,
        token: token // Include the token in the data
      };

      // Get the session ID
      const sessionId = getSessionId();
      if (!sessionId) {
        throw new Error('No session ID available. Security not properly initialized.');
      }

      // Encrypt the review data
      const jsonData = JSON.stringify(reviewData);
      const encryptedData = await encrypt(jsonData);

      // Create the secure request
      const secureRequest = {
        sessionId,
        encryptedData
      };

      // the POST request to submit the review
      const response = await fetch('/api/reviews/', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(secureRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Decrypt the response
      const responseData = await response.json();
      if (responseData && responseData.encryptedData) {
        const decryptedResponse = await decrypt(responseData.encryptedData);
        console.log("Review submitted successfully:", JSON.parse(decryptedResponse));

        // Publish an event to notify that a new review was added
        eventBus.publish('reviewAdded', { menuItemId });
      } else {
        console.log("Review submitted, but no response data received");
      }

      // Close dialog and reset form
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Half-Star Rating component (1-10 scale)
  const HalfStarRating = ({ stars, onSetRating, hoveredRating, onHover }) => {
    const totalStars = 5;

    // Convert the rating (1-10) to a value out of 5 for display
    const displayRating = hoveredRating > 0 ? hoveredRating / 2 : stars / 2;

    const getStarFill = (position) => {
      if (displayRating >= position) return "full";
      if (displayRating >= position - 0.5) return "half";
      return "empty";
    };

    return (
      <div className="flex items-center">
        {Array.from({ length: totalStars }).map((_, index) => {
          const position = index + 1;
          const fill = getStarFill(position);

          return (
            <div key={position} className="relative h-8 w-8">
              {/* Left half */}
              <div
                className="absolute left-0 top-0 w-4 h-8 overflow-hidden cursor-pointer"
                onClick={() => onSetRating((position * 2) - 1)}
                onMouseEnter={() => onHover((position * 2) - 1)}
                onMouseLeave={() => onHover(0)}
              >
                <Star
                  className={`h-8 w-8 -ml-0 ${fill === "full" || fill === "half"
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              </div>

              {/* Right half */}
              <div
                className="absolute right-0 top-0 w-4 h-8 overflow-hidden cursor-pointer"
                onClick={() => onSetRating(position * 2)}
                onMouseEnter={() => onHover(position * 2)}
                onMouseLeave={() => onHover(0)}
              >
                <Star
                  className={`h-8 w-8 -ml-4 ${fill === "full"
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="text-2xl font-semibold flex flex-row justify-between md:max-lg:flex-none">
      <p>Reviews</p>

      {isLoggedIn ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="grow ms-4">
              <PlusCircle className="h-6 w-6 mr-2" />
              Add review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Review</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="stars"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <HalfStarRating
                          stars={field.value}
                          onSetRating={(value) => field.onChange(value)}
                          hoveredRating={hoveredRating}
                          onHover={setHoveredRating}
                        />
                      </FormControl>
                      <FormDescription>
                        Rate this menu item from 1 to 5 stars
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts..."
                          className="resize-none min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Button className="grow ms-4" onClick={handleLoginRedirect}>
          <LogIn className="h-6 w-6 mr-2" />
          Login to Review
        </Button>
      )}
    </div>
  );
};

export { NewReviewButton };