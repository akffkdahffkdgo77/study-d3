import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const OPTIONS = [
    { name: 'Area', to: '/area' },
    { name: 'Bar', to: '/bar' },
    { name: 'Bubble', to: '/bubble' },
    { name: 'Donut', to: '/donut' },
    { name: 'Gradient Donut', to: '/gradient-donut' },
    { name: 'Grouped Bar', to: '/grouped-bar' },
    { name: 'Line', to: '/line' },
    { name: 'Multi Line', to: '/multi-line' },
    { name: 'Scatter Line', to: '/scatter-line' },
    { name: 'Stacked Bar', to: '/stacked-bar' }
];

export default function BaseLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div className="w-full">
            <header className="fixed top-0 flex- shadow-md left-0 right-0 w-full h-16 backdrop-blur-sm bg-white">
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
                    <Link to="/" className="">
                        <h1 className="text-2xl font-bold">Study D3.js</h1>
                    </Link>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="border rounded bg-white h-10 w-40 font-bold"
                        >
                            {OPTIONS.find((val) => val.to === pathname).name}
                        </button>
                        {isOpen && (
                            <nav className="absolute top-11 z-10 bg-white shadow-md rounded border w-40 py-1">
                                <ul className="flex flex-col divide-y overflow-y-auto max-h-40">
                                    {OPTIONS.map((val) => (
                                        <li className="h-10 flex-none leading-10 hover:opacity-50">
                                            <Link to={val.to} className="font-medium text-center w-full block">
                                                {val.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </header>
            <div className="mx-auto pt-16 h-screen flex items-center justify-center max-w-7xl">
                <main className="flex items-center justify-center w-full rounded border shadow-xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
