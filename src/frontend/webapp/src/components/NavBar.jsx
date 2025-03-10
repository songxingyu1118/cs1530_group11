import React from 'react';

import { Button } from "@/components/ui/Button"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { Link } from 'react-router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"





function NavBar({menuSections}) {
    return (
        <div className='flex flex-col'>
            <div className='bg-gray-400 flex items-center justify-center'>
                <span className='text-8xl font-bold my-3'>Logo</span>
            </div>

            <div className='flex justify-between bg-gray-200 px-3 rounded-sm'>
                <ScrollArea className="w-5/6 whitespace-nowrap rounded-md border py-2">
                    {menuSections.map((item, index) => (
                        <Link key={index} to={`#${item}`} className='px-1'>
                            <Button>{item}</Button>
                        </Link>
                    ))}
                    <ScrollBar orientation='horizontal' className="bg-red-600"/>
                </ScrollArea>
                
                <div className='flex gap-2'>
                    <Link to="/cart">
                        <Button size="rounded">
                            5 <FontAwesomeIcon icon={faCartShopping} className="" />
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button size="rounded">Log In</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
  }

export { NavBar };