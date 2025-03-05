import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter
  } from "@/components/ui/card"
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons"

function MenuItem({title, description, rating, price, image}) {

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

    return (
        <div className="">
            <Card>
                <CardContent>
                <CardDescription>
                    <div className='flex flex-row gap-4'>
                        <div class="flex-none w-1/2">
                            <img src={image} alt={title} className='rounded-md' />
                        </div>
                        
                        <div className='flex flex-col'>
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
       </div>
    );
  }

export { MenuItem };