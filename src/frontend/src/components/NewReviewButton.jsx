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
} from "@/components/ui/dialog"

import { PlusCircle } from 'lucide-react';


const NewReviewButton = ({ menuItemId }) => {
  return (
    <div className="text-2xl font-semibold flex flex-row justify-between md:max-lg:flex-none">
      <p>Reviews</p>
      <Button className="grow ms-4">
        <PlusCircle className="h-6 w-6" />
        <p>Add review</p>
      </Button>
    </div>
  );
}

export { NewReviewButton };