import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useState, useEffect } from 'react';

interface ChartDataItem {
  id: string;
  name: string;
  total: number;
}

interface CostChartProps {
  data: ChartDataItem[];
  onSelect: (id: string) => void;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(payload[0].value);

  return (
    <div
      className="recharts-custom-tooltip px-3 py-2 rounded-lg shadow-md text-sm font-semibold"
      style={{
        backgroundColor: 'var(--color-tooltip-bg)',
        color: '#f9fafb',
        border: '1px solid var(--color-border-dark)',
        transition: 'background-color 300ms ease-in-out',
      }}
    >
      <p className="font-bold mb-0.5" style={{ color: 'var(--color-primary)' }}>{label}</p>
      <p>{value}</p>
    </div>
  );
}

export default function CostChart({ data, onSelect }: CostChartProps) {
  if (!data || data.length === 0) return null;

  // Track viewport width to adjust chart layout for small screens
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isSmall = width < 480;
  // On very small screens hide every other X-axis label
  const xAxisInterval = isSmall && data.length > 4 ? 1 : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits: 3,
      notation: 'compact',
    }).format(value);

  const handleBarClick = (barData: any) => {
    if (barData && barData.id) {
      onSelect(barData.id);
    }
  };

  return (
    <div
      className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl shadow-sm border transition-colors duration-300 ease-in-out"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      role="img"
      aria-label="Bar chart showing total cost per infrastructure entity"
    >
      {/* Smaller chart height on mobile, taller on larger screens */}
      <div className="h-48 sm:h-64 md:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: isSmall ? 4 : 10, left: isSmall ? 0 : 10, bottom: 5 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="5 5"
              // Uses CSS variable — SVG stroke transitions with the theme automatically
              stroke="var(--color-chart-grid)"
              strokeOpacity={1}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={xAxisInterval}
              tick={{
                fontSize: isSmall ? 9 : 12,
                fontWeight: 'bold',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fill: 'var(--color-chart-text)',
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
              tick={{
                fontSize: isSmall ? 9 : 11,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fill: 'var(--color-chart-text)',
              }}
              width={isSmall ? 45 : 70}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--color-row-hover)', radius: 6 }}
            />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              onClick={handleBarClick}
              fill="var(--color-primary)"
              style={{ cursor: 'pointer', transition: 'fill 300ms ease-in-out' }}
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
