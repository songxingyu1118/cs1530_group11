import { HomeIcon } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const FourOFour = () => {
  return (
    <div className=' w-screen h-screen flex justify-center items-center'>
      <Card className='w-11/12 max-w-xl'>
        <CardHeader>
          <CardTitle className='text-3xl'>404</CardTitle>
          <CardDescription>Oh oh! This page doesn't exist!</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to='/' className='w-full'>
            <Button className='w-full'>
              <HomeIcon className='mr-2 h-4 w-4' /> Go Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FourOFour;
