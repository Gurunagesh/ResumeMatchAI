'use client';

import { Briefcase } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-gray-800">
            ResumeMatch AI
          </h1>
        </div>
      </div>
    </header>
  );
}
