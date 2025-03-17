import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import { PlusCircle } from 'lucide-react';

const NewReviewButton = ({ menuItemId }) => {
  return (
    <div className="text-2xl font-semibold flex flex-row justify-between md:max-lg:flex-none">
      <p>Reviews</p>


      {/* ADD CONDITIONAL CHECK. IF REVIEW HAS BEEN MADE, DONT SHOW BUTTON*/}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="grow ms-4">
            <PlusCircle className="h-6 w-6" />
            <p>Add review</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>New Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              {/* Star Rating from 2-10 (1 star-5 stars) */}
              <Input id="name" value="Stars" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="review" className="text-right">
                Review
              </Label>
              <Input id="review" value="Review" className="col-span-3" />
            </div>      
          </div>
          <DialogFooter>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
     
    </div>

    
  );
}

export { NewReviewButton };