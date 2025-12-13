'use client';

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

type MatchScoreChartProps = {
  score: number;
};

export function MatchScoreChart({ score }: MatchScoreChartProps) {
  const data = [{ name: 'score', value: score }];
  const color =
    score > 80 ? '#22c55e' : score > 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="80%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={12}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-4xl font-bold font-headline"
          >
            {`${score}%`}
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
