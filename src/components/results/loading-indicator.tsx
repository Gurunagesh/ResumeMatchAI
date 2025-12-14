'use client';

import { Spinner } from '@/components/ui/spinner';

export const LoadingIndicator = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center h-full min-h-[400px]">
    <Spinner className="h-8 w-8 text-primary" />
    <p className="text-muted-foreground font-medium">{text}</p>
  </div>
);

    