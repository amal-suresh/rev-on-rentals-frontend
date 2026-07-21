import React from 'react';

const AdminLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full py-12">
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-800/60"></div>
                {/* Spinning Progress Sector */}
                <div className="absolute inset-0 rounded-full border-4 border-t-sky-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
                Loading Data...
            </p>
        </div>
    );
};

export default AdminLoader;
