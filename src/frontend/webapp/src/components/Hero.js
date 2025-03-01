// Debugging component to help with testing text.
import React from 'react';
import '../css/Components.css';

const Hero = () => {
    return (
        
        <div className='hero'>
            
            {/* <img src={static_jpeg} alt='Restaurant' /> */}
                

            <div className="hero-text">
                <h1>Restaurant Name</h1>
            </div>
        </div>
    );
};

export default Hero;