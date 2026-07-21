import React from 'react'

function BrandCarousel() {
    const brands = [
        {
            name: 'Royal Enfield',
            color: 'hover:border-yellow-500/40 hover:bg-yellow-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Classic Shield/Crown emblem */}
                    <path d="M12 2L4 5v6c0 5.25 3.42 10.18 8 11 4.58-.82 8-5.75 8-11V5l-8-3zm0 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM12 18c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" />
                </svg>
            )
        },
        {
            name: 'Harley-Davidson',
            color: 'hover:border-orange-500/40 hover:bg-orange-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Eagle shield outline */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            )
        },
        {
            name: 'KTM',
            color: 'hover:border-orange-600/40 hover:bg-orange-600/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* KTM sharp geometric pattern */}
                    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8l3-3 3 3h-2v4h-2v-4H9z" />
                </svg>
            )
        },
        {
            name: 'Yamaha',
            color: 'hover:border-blue-400/40 hover:bg-blue-400/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Tuning forks concept */}
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" />
                </svg>
            )
        },
        {
            name: 'Kawasaki',
            color: 'hover:border-lime-500/40 hover:bg-lime-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-lime-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Kawasaki bold K lines */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2V8h2v8zm3-4l-3 3v-3l3-3v3z" />
                </svg>
            )
        },
        {
            name: 'Honda',
            color: 'hover:border-red-500/40 hover:bg-red-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Wing concept */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5zm-1.5-3.5c-2.48 0-4.5-2.02-4.5-4.5S9.02 5 11.5 5 16 7.02 16 9.5 13.98 14 11.5 14z" />
                </svg>
            )
        },
        {
            name: 'BMW Motorrad',
            color: 'hover:border-cyan-400/40 hover:bg-cyan-400/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {/* Roundel target */}
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <path d="M12 2v20M2 12h20" />
                </svg>
            )
        },
        {
            name: 'Suzuki',
            color: 'hover:border-red-600/40 hover:bg-red-600/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-600 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Stylized S shape */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.18 10.18l-5.64 5.64c-.39.39-1.02.39-1.41 0L6.3 14.98c-.39-.39-.39-1.02 0-1.41l5.64-5.64c.39-.39 1.02-.39 1.41 0l2.83 2.83c.39.39.39 1.02 0 1.42z" />
                </svg>
            )
        },
        {
            name: 'Ducati',
            color: 'hover:border-red-500/40 hover:bg-red-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Shield outline */}
                    <path d="M12 2L4 5v11c0 4.52 3.4 8.21 8 9 4.6-.79 8-4.48 8-9V5l-8-3zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-11v4h2V9h-2z" />
                </svg>
            )
        },
        {
            name: 'Triumph',
            color: 'hover:border-sky-500/40 hover:bg-sky-500/5',
            icon: (
                <svg className="w-6 h-6 text-gray-400 group-hover:text-sky-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    {/* Crown/Triumph logo */}
                    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2V8h2v8zm-4-6h2V8H9v2zm6 0h2V8h-2v2z" />
                </svg>
            )
        }
    ];

    // Duplicate brand badges to facilitate seamless infinite marquee loop scrolling
    const listItems = [...brands, ...brands, ...brands];

    const marqueeStyle = `
    @keyframes marqueeScroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-33.3333%);
      }
    }
    .animate-marquee-scroll {
      animation: marqueeScroll 25s linear infinite;
    }
    .animate-marquee-scroll:hover {
      animation-play-state: paused;
    }
  `;

    return (
        <div className="w-full bg-[#030712] border-y border-neutral-900 overflow-hidden py-6 relative">
            <style>{marqueeStyle}</style>

            {/* Side Fade Mask Overlays to make it blend into the dark screen */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max animate-marquee-scroll">
                {listItems.map((brand, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 px-6 py-2.5 mx-4 bg-[#0B132B]/20 border border-neutral-800/60 rounded-full select-none transition-all duration-300 group cursor-pointer ${brand.color}`}
                    >
                        {brand.icon}
                        <span className="text-gray-300 font-semibold text-sm tracking-wide group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                            {brand.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BrandCarousel
