'use client';
import { diffChars } from 'diff';

export const ResumeDiff = ({ oldStr, newStr }: { oldStr: string; newStr: string }) => {
  const diff = diffChars(oldStr, newStr);

  return (
    <pre className="whitespace-pre-wrap font-body text-sm p-4 rounded-md border bg-muted/20 max-h-[500px] overflow-y-auto">
      {diff.map((part, index) => {
        const style = part.added
          ? { backgroundColor: 'rgba(67, 205, 128, 0.2)', color: '#2b633f', textDecoration: 'underline' } // More subtle green
          : part.removed
          ? { backgroundColor: 'rgba(255, 100, 100, 0.2)', textDecoration: 'line-through' } // More subtle red
          : { color: 'hsl(var(--muted-foreground))' };
        
        return (
          <span key={index} style={style}>
            {part.value}
          </span>
        );
      })}
    </pre>
  );
};
