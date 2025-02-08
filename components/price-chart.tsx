'use client';

import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatChartPrice } from '@/lib/format';
import { TIMEFRAME } from '@/types/chart';

interface PriceChartProps {
  data: {
    time: number;
    value: number;
  }[];
  timeFrame: TIMEFRAME;
  tokenInfo: {
    symbol: string;
    address: string;
  };
}

function formatDate(time: number, timeFrame: TIMEFRAME) {
  const date = new Date(time);
  switch (timeFrame) {
    case TIMEFRAME.DAYS:
      return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    case TIMEFRAME.HOURS:
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    default:
      return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
  }
}

function shortenAddress(addr: string) {
  return addr.length <= 10 ? addr : `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export default function PriceChart({ data, timeFrame, tokenInfo: { symbol, address } }: PriceChartProps) {
  const transformedData = data.map((point) => ({
    date: formatDate(point.time, timeFrame),
    price: point.value,
  }));

  return (
    <Card>
      <CardHeader className="border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>{symbol} Price</CardTitle>
          <CardDescription>
            Contract Address:
            <span className="hidden sm:inline"> {address}</span>
            <span className="inline sm:hidden"> {shortenAddress(address)}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={true} tickMargin={8} />
            <YAxis
              tickFormatter={(value) => formatChartPrice(value)}
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-background p-2 shadow-md">
                      <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Price: {formatChartPrice(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
