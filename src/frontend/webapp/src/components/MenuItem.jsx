import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

function MenuItem({title, description, rating, price, image}) {
    return (
        <div className="">
            <Card>
                <CardContent>
                <CardDescription>
                    <div className='flex flex-row gap-4 items-center'>
                        <div class="flex-none w-1/2">
                            <img src={image} alt={title} className='rounded-md' />
                        </div>
                        
                        <div className='flex flex-col'>
                            <h1 className='text-xl font-bold'>{title}</h1>
                            <p className="line-clamp-3">{description}</p>
                        </div>                        
                    </div>
                </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div>{rating} stars</div>
                    <div>${price}</div>
                </CardFooter>
            </Card>
       </div>
    );
  }

export { MenuItem };