import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>Ecoleta</h1>
        </header>
    );
}

export default Header;