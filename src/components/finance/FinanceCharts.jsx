import { useMemo, useRef, useState } from 'react';
import { alpha, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/format';

const PIE_COLORS = ['#4f46e5', '#14b8a6', '#f59e0b'];

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function getSafeFileName(value) {
  return String(value || 'chart')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSvgMarkup(svgElement) {
  const clone = svgElement.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  const bounds = svgElement.getBoundingClientRect();
  if (!clone.getAttribute('width') && bounds.width) {
    clone.setAttribute('width', String(bounds.width));
  }
  if (!clone.getAttribute('height') && bounds.height) {
    clone.setAttribute('height', String(bounds.height));
  }

  return new XMLSerializer().serializeToString(clone);
}

async function svgElementToPngDataUrl(svgElement) {
  const svgMarkup = getSvgMarkup(svgElement);
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();
    image.decoding = 'async';

    await new Promise((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = objectUrl;
    });

    const width = Math.max(Math.round(svgElement.getBoundingClientRect().width || 1200), 1);
    const height = Math.max(Math.round(svgElement.getBoundingClientRect().height || 800), 1);
    const scale = 2;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context unavailable');
    }

    context.scale(scale, scale);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function openPrintableWindow({ title, subtitle, svgMarkup }) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1280,height=960');

  if (!printWindow) {
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
            color: #0f172a;
          }
          .page {
            padding: 32px;
          }
          .header {
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px;
          }
          .subtitle {
            margin: 0;
            color: #64748b;
            font-size: 14px;
          }
          .card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
          }
          svg {
            width: 100% !important;
            height: auto !important;
          }
          @media print {
            body {
              background: #fff;
            }
            .page {
              padding: 0;
            }
            .card {
              border: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1 class="title">${title}</h1>
            <p class="subtitle">${subtitle || ''}</p>
          </div>
          <div class="card">
            ${svgMarkup}
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function ChartCard({ title, subtitle, children, minHeight = 320 }) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0.94)})`,
        boxShadow: `0 18px 48px ${theme.palette.mode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(0, 0, 0, 0.35)'}`,
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 24px 56px ${theme.palette.mode === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(0, 0, 0, 0.42)'}`,
        },
      })}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
        <Stack spacing={2.25} sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
          </Box>
          <Box sx={{ minHeight, width: '100%' }}>{children}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function FinanceCharts({ chartSeries }) {
  const { t } = useTranslation();
  const chartDialogContentRef = useRef(null);
  const [activeChartKey, setActiveChartKey] = useState(null);

  const chartData = useMemo(
    () =>
      chartSeries.map((record) => {
        const revenue = Number(record.revenue || 0);
        const profit = Number(record.profit || 0);

        return {
          ...record,
          marginPct: revenue > 0 ? (profit / revenue) * 100 : 0,
        };
      }),
    [chartSeries],
  );

  const pieData = useMemo(
    () =>
      chartSeries.length
        ? [
            { name: t('finance.charts.revenue'), value: chartSeries.reduce((sum, record) => sum + Number(record.revenue || 0), 0) },
            { name: t('finance.cards.deposits'), value: chartSeries.reduce((sum, record) => sum + Number(record.deposits || 0), 0) },
            { name: t('finance.charts.profit'), value: Math.max(chartSeries.reduce((sum, record) => sum + Number(record.profit || 0), 0), 0) },
          ]
        : [],
    [chartSeries, t],
  );

  const chartDefinitions = useMemo(
    () => [
      {
        key: 'revenue-over-time',
        title: t('finance.charts.revenueOverTime'),
        subtitle: t('finance.charts.revenueOverTimeSubtitle'),
        fileName: 'revenue-over-time',
        render: ({ enlarged = false } = {}) => (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartSeries}>
              <defs>
                <linearGradient id={`revenueLineGlow${enlarged ? '-large' : ''}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <RechartsTooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => label}
                contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: enlarged ? 5 : 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: enlarged ? 8 : 7 }}
                isAnimationActive
                animationDuration={800}
                fill={`url(#revenueLineGlow${enlarged ? '-large' : ''})`}
              />
            </LineChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: 'revenue-vs-profit',
        title: t('finance.charts.revenueVsProfit', { defaultValue: 'Revenue vs Profit' }),
        subtitle: t('finance.charts.revenueVsProfitSubtitle', { defaultValue: 'Compare sales and profit across the selected range.' }),
        fileName: 'revenue-vs-profit',
        render: ({ enlarged = false } = {}) => (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <RechartsTooltip
                formatter={(value, name) => [formatCurrency(value), name === 'profit' ? t('finance.charts.profit') : t('finance.charts.revenue')]}
                contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" fill="rgba(79, 70, 229, 0.14)" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: enlarged ? 6 : 5 }} isAnimationActive animationDuration={800} />
              <Line type="monotone" dataKey="profit" stroke="#14b8a6" strokeWidth={3} dot={{ r: enlarged ? 4 : 3 }} activeDot={{ r: enlarged ? 7 : 6 }} isAnimationActive animationDuration={800} />
            </ComposedChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: 'orders-per-day',
        title: t('finance.charts.ordersPerDay'),
        subtitle: t('finance.charts.ordersPerDaySubtitle'),
        fileName: 'orders-per-day',
        render: () => (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <RechartsTooltip
                formatter={(value) => Number(value).toLocaleString()}
                contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)' }}
              />
              <Bar dataKey="ordersCount" fill="#14b8a6" radius={[10, 10, 0, 0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: 'revenue-distribution',
        title: t('finance.charts.revenueDistribution'),
        subtitle: t('finance.charts.revenueDistributionSubtitle'),
        fileName: 'revenue-distribution',
        render: ({ enlarged = false } = {}) => (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={enlarged ? 92 : 70}
                outerRadius={enlarged ? 140 : 110}
                paddingAngle={4}
                isAnimationActive
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ),
      },
      {
        key: 'profit-margin-trend',
        title: t('finance.charts.profitMarginTrend', { defaultValue: 'Profit Margin Trend' }),
        subtitle: t('finance.charts.profitMarginTrendSubtitle', { defaultValue: 'Shows the margin efficiency across the selected period.' }),
        fileName: 'profit-margin-trend',
        render: () => (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="marginArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatPercent} />
              <RechartsTooltip
                formatter={(value) => formatPercent(value)}
                contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)' }}
              />
              <Area type="monotone" dataKey="marginPct" stroke="#f59e0b" strokeWidth={3} fill="url(#marginArea)" isAnimationActive animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        ),
      },
    ],
    [chartData, chartSeries, pieData, t],
  );

  const activeChart = chartDefinitions.find((chart) => chart.key === activeChartKey) || null;

  async function handlePrintActiveChart() {
    const svgElement = chartDialogContentRef.current?.querySelector('svg');

    if (!svgElement || !activeChart) {
      return;
    }

    openPrintableWindow({
      title: activeChart.title,
      subtitle: activeChart.subtitle,
      svgMarkup: getSvgMarkup(svgElement),
    });
  }

  async function handleExportActiveChartToPdf() {
    const svgElement = chartDialogContentRef.current?.querySelector('svg');

    if (!svgElement || !activeChart) {
      return;
    }

    const pngDataUrl = await svgElementToPngDataUrl(svgElement);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 36;
    const titleY = margin + 6;
    const subtitleY = margin + 24;
    const imageY = margin + 46;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(activeChart.title, margin, titleY);

    if (activeChart.subtitle) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(activeChart.subtitle, margin, subtitleY);
      pdf.setTextColor(15, 23, 42);
    }

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - imageY - margin;
    const imgProps = pdf.getImageProperties(pngDataUrl);
    const imageWidth = imgProps.width;
    const imageHeight = imgProps.height;
    const ratio = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
    const drawWidth = imageWidth * ratio;
    const drawHeight = imageHeight * ratio;

    pdf.addImage(pngDataUrl, 'PNG', margin, imageY, drawWidth, drawHeight);
    pdf.save(`${getSafeFileName(activeChart.fileName)}.pdf`);
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 3, alignItems: 'stretch' }}>
        {chartDefinitions.slice(0, 2).map((chart) => (
          <ChartCard
            key={chart.key}
            title={chart.title}
            subtitle={chart.subtitle}
            minHeight={340}
          >
            <Stack spacing={1.5} sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title={t('common.expand', { defaultValue: 'Enlarge chart' })}>
                  <IconButton
                    size="small"
                    onClick={() => setActiveChartKey(chart.key)}
                    aria-label={t('common.expand', { defaultValue: 'Enlarge chart' })}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ minHeight: 300, width: '100%' }}>{chart.render()}</Box>
            </Stack>
          </ChartCard>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 3, alignItems: 'stretch' }}>
        {chartDefinitions.slice(2).map((chart) => (
          <ChartCard
            key={chart.key}
            title={chart.title}
            subtitle={chart.subtitle}
            minHeight={340}
          >
            <Stack spacing={1.5} sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title={t('common.expand', { defaultValue: 'Enlarge chart' })}>
                  <IconButton
                    size="small"
                    onClick={() => setActiveChartKey(chart.key)}
                    aria-label={t('common.expand', { defaultValue: 'Enlarge chart' })}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ minHeight: 300, width: '100%' }}>{chart.render()}</Box>
            </Stack>
          </ChartCard>
        ))}
      </Box>

      <Dialog
        open={Boolean(activeChart)}
        onClose={() => setActiveChartKey(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 4,
            overflow: 'hidden',
            background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0.97)})`,
            boxShadow: `0 28px 80px ${theme.palette.mode === 'light' ? 'rgba(15, 23, 42, 0.22)' : 'rgba(0, 0, 0, 0.6)'}`,
          }),
        }}
      >
        {activeChart ? (
          <>
            <DialogTitle sx={{ pb: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                    {activeChart.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeChart.subtitle}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActiveChartKey(null)} aria-label={t('common.close', { defaultValue: 'Close' })}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                ref={chartDialogContentRef}
                sx={(theme) => ({
                  height: { xs: 420, md: 560 },
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.03)})`,
                  p: 2,
                })}
              >
                {activeChart.render({ enlarged: true })}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2.5, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
              <Button startIcon={<PrintIcon />} variant="outlined" onClick={handlePrintActiveChart}>
                {t('common.print', { defaultValue: 'Print' })}
              </Button>
              <Stack direction="row" spacing={1.5}>
                <Button onClick={() => setActiveChartKey(null)}>
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </Button>
                <Button startIcon={<PictureAsPdfIcon />} variant="contained" onClick={handleExportActiveChartToPdf}>
                  {t('common.exportPdf', { defaultValue: 'Export PDF' })}
                </Button>
              </Stack>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Stack>
  );
}

export default FinanceCharts;