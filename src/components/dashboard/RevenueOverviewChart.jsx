import { Box, Card, CardContent, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function RevenueOverviewChart({ data }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.4,
        border: `1px solid ${alpha('#0f172a', 0.09)}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3.25, '&:last-child': { pb: 3.25 } }}>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1.22, color: '#0f172a', fontWeight: 700, mb: 2.35 }}>
          Revenue Overview
        </Typography>

        <Box sx={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 10, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={alpha('#94a3b8', 0.48)} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 10000]}
                ticks={[0, 2500, 5000, 7500, 10000]}
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${alpha('#0f172a', 0.1)}`,
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.14)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 4.5, fill: '#3b82f6', strokeWidth: 2, stroke: '#3b82f6' }}
                activeDot={{ r: 7, fill: '#2563eb', stroke: '#dbeafe', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RevenueOverviewChart;
