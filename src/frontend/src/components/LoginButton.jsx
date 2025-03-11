import React from 'react';
import { Link } from 'react-router'
import { Button } from "@/components/ui/Button"

function LoginButton({}) {
    return (
        <Link to="/login">
            <Button size="rounded">Log In</Button>
        </Link>
    );
}

export { LoginButton };