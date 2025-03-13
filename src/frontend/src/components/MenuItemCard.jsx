import { FileX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { useState } from "react";
import { Link } from "react-router-dom";

const MenuItemCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="transition-all hover:shadow-md h-112 pt-0">
      <Link to={`/menu/${item.id}`} className="aspect-video relative overflow-hidden">
        {item.imagePath && !imageError ? (
          <div className="w-full h-full overflow-hidden rounded-sm">
            <img
              src={item.imagePath}
              alt={item.name}
              className="object-cover w-full h-full transition-transform hover:scale-110"
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
      </Link>
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
        <Button className="w-full" onClick={() => null}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export { MenuItemCard };
