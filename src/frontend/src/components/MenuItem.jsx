import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

import { LoremIpsum } from "@/components/LoremIpsum";



function MenuItem({ title, description, rating, price, image }) {

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key={fullStars} icon={faStarHalfAlt} className="text-yellow-500" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={fullStars + i + 1} icon={faStar} className="text-gray-300" />);
    }

    return stars;
  };

  const imageSrc = image;

  return (
    <div className="">

      <Dialog>
        <DialogTrigger>
          <Card>
            <CardContent>
              <CardDescription>
                <div className='flex flex-row gap-4'>
                  <div class="flex-none w-1/2">
                    <img src={imageSrc} alt={title} className='rounded-md' />
                  </div>

                  <div className='flex flex-col text-left'>
                    <h1 className='text-xl font-bold text-black'>{title}</h1>
                    <p className="line-clamp-3 md:line-clamp-4 lg:line-clamp-6 xl:line-clamp-8 text-neutral-400">{description}</p>
                  </div>
                </div>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className='flex gap-1'>
                {renderStars(rating)}
              </div>


              <div className="text-neutral-400">${price}</div>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>
              <div className='flex flex-row gap-3 items-center'>
                {title}
                <div className='text-neutral-400 text-xs'>{price}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              <ScrollArea className="h-48 my-2">
                <div>
                  {description}
                </div>
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">

            </div>
            <div className="grid grid-cols-4 items-center gap-4">

            </div>
          </div>
          <DialogFooter>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { MenuItem };