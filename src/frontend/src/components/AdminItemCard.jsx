import { FileX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminItemCard = ({ item, editFunction, deleteFunction }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="transition-all h-112 pt-0">
      <div className="aspect-video relative overflow-hidden">
        {item.imagePath && !imageError ? (
          <div className="w-full h-full overflow-hidden rounded-sm">
            <img
              src={item.imagePath}
              alt={item.name}
              className="object-cover w-full h-full transition-transform"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <FileX className="w-full h-full text-gray-300" />
        )}
        {item.isNew && (
          <Badge className="absolute top-2 right-2 bg-red-500">New</Badge>
        )}
        {item.featured && (
          <Badge className="absolute top-2 left-2 bg-amber-500">Featured</Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{item.name}</CardTitle>
          <div className="text-xl font-bold text-green-700">${item.price.toFixed(2)}</div>
        </div>
        <StarRating rating={item.rating} reviewCount={item.reviewCount} />
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button className="w-1/2 me-1" onClick={() => editFunction(item)}>Edit</Button>
        <Button variant="destructive" className="w-1/2 ms-1" onClick={() => deleteFunction(item.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export { AdminItemCard };
