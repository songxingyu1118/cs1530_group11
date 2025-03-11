import React from 'react';

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LoginButton } from '@/components/LoginButton';

import { Link, useNavigate } from 'react-router-dom';  // <-- Change it to 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import '@/css/Components.scss';

function NavBar({ menuSections }) {
    const [activeIndex, setActiveIndex] = React.useState(null);
    const navigate = useNavigate(); // <-- Here we import useNavigate

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const isLoggedIn = token && username;

    const handleLogout = () => {
        // Clear login information when you log out
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        // Go back to the home page and refresh the page to update the state
        navigate('/');
        window.location.reload();
    };

    const handleButtonClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className='flex flex-col max-w-full'>
            <div className='bg-[#382E28] flex flex-col items-center justify-center'>
                <span className='text-8xl font-bold my-3 text-white'>Logo</span>
                <div className='flex justify-center gap-3 text-white'>
                    <span className='mx-2'>Phone: (123) 456-7890</span>
                    <span className='mx-2'>Location: 123 Main St, City, Country</span>
                </div>
            </div>

            <div className='flex justify-between px-3 rounded-b-sm items-center bg-[#F2F3F5]'>
                <ScrollArea className="whitespace-nowrap py-3 flex-grow overflow-x-auto">
                    {menuSections.map((item, index) => (
                        <a key={index} href={`#${item}`} className='px-1'>
                            <Button
                                onClick={() => handleButtonClick(index)}
                                variant={activeIndex === index ? 'secondaryOutline' : 'default'}
                            >
                                {item}
                            </Button>
                        </a>
                    ))}
                    <ScrollBar orientation='horizontal' className="sections-scroll-bar" />
                </ScrollArea>

                <div className='flex grow-0 gap-2 ml-3 items-center'>
                    {/* If you are logged in, the welcome message is displayed to the left of the shopping cart button */}
                    {isLoggedIn && (
                        <span className="welcome-message">Welcome, {username}!</span>
                    )}

                    <Link to="/cart">
                        <Button size="rounded">
                            5 <FontAwesomeIcon icon={faCartShopping} className="" />
                        </Button>
                    </Link>

                    {/* Display Logout if logged in, LoginButton otherwise */}
                    {isLoggedIn ? (
                        <Button onClick={handleLogout}>Logout</Button>
                    ) : (
                        <LoginButton />
                    )}
                </div>
            </div>
        </div>
    );
}

export { NavBar };