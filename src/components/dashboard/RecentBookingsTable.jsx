import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const STATUS_STYLES = {
  confirmed: {
    color: '#1d4ed8',
    bg: alpha('#2563eb', 0.17),
  },
  pending: {
    color: '#b57200',
    bg: alpha('#f59e0b', 0.26),
  },
  completed: {
    color: '#047857',
    bg: alpha('#22c55e', 0.24),
  },
  cancelled: {
    color: '#b91c1c',
    bg: alpha('#ef4444', 0.2),
  },
};

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function RecentBookingsTable({ bookings }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.4,
        border: `1px solid ${alpha('#0f172a', 0.09)}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ px: 3.25, py: 2.45, borderBottom: `1px solid ${alpha('#0f172a', 0.08)}` }}>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1.22, color: '#0f172a', fontWeight: 700 }}>
          Recent Bookings
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>BOOKING ID</TableCell>
              <TableCell sx={headerCellSx}>CUSTOMER</TableCell>
              <TableCell sx={headerCellSx}>SERVICE</TableCell>
              <TableCell sx={headerCellSx}>PROVIDER</TableCell>
              <TableCell sx={headerCellSx}>DATE & TIME</TableCell>
              <TableCell sx={headerCellSx}>STATUS</TableCell>
              <TableCell sx={headerCellSx}>AMOUNT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((row) => {
              const style = STATUS_STYLES[row.status] || STATUS_STYLES.pending;

              return (
                <TableRow
                  key={row.id}
                  sx={{
                    '& .MuiTableCell-root': {
                      borderColor: alpha('#0f172a', 0.08),
                      py: 2.5,
                    },
                    transition: 'background-color 150ms ease',
                    '&:hover': {
                      backgroundColor: alpha('#f8fafc', 0.85),
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>{row.id}</TableCell>
                  <TableCell sx={bodyCellSx}>{row.customer}</TableCell>
                  <TableCell sx={bodyCellSx}>{row.service}</TableCell>
                  <TableCell sx={bodyCellSx}>{row.provider}</TableCell>
                  <TableCell sx={bodyCellSx}>{row.dateTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(row.status)}
                      sx={{
                        height: 40,
                        borderRadius: 20,
                        px: 0.8,
                        backgroundColor: style.bg,
                        color: style.color,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>{row.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

const headerCellSx = {
  py: 1.85,
  fontSize: '0.84rem',
  color: '#334e73',
  letterSpacing: '0.04em',
  fontWeight: 700,
  borderColor: alpha('#0f172a', 0.08),
};

const bodyCellSx = {
  fontSize: '1rem',
  color: '#1f344f',
  fontWeight: 500,
};

export default RecentBookingsTable;
