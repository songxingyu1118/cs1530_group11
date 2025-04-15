import * as React from 'react';

import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500">
      <div>
        <h3 className="font-medium text-black mb-2">Hours</h3>
        <p>Monday - Friday: 7am - 11pm</p>
        <p>Saturday - Sunday: 10am - 7pm</p>
      </div>
      <div>
        <h3 className="font-medium text-black mb-2">Location</h3>
        <p>University of Pittsburgh</p>
        <p>4200 Fifth Ave</p>
        <p>Pittsburgh, PA 15260</p>
        <p>Phone: (555) 123-4567</p>
      </div>
      <div>
        <h3 className="font-medium text-black mb-2">About Us</h3>
        <p>Terrible Food 0/10 would not recommend</p>
        <Button variant="link" className="p-0 h-auto text-sm">Learn more</Button>
      </div>
    </div>
  );
};

export { Footer };