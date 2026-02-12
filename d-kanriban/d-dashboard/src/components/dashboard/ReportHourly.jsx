import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Download as DownloadIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ReportHourly = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
  const [refreshCount, setRefreshCount] = useState(0);

  // Get unique line names from the data
  const lineNames = [
    'BS1', 'BS2', 'RET', 'CONN', 'RA', 'HLA', 'CR1', 'CR2', 'CR3', 'CR4', 'CR5', 'CR6', 'CR7', 'CR8', 'CR9', 'CR10', 'CR11', 'CR12',
    'CC1', 'CC234', 'CHAB', 'CHCD', 'CHEF', 'CHSAA', 'CHSAB', 'CHSAC', 'KUB1'
  ];

  // Generate years (last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // Generate days
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    fetchData();
  }, [selectedLine, selectedYear, selectedMonth, selectedDay, refreshCount]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `http://localhost:4000/api/pm-hourly-kwh`;
      
      const params = new URLSearchParams();
      if (selectedLine) params.append('lineName', selectedLine);
      if (selectedYear) params.append('year', selectedYear);
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedDay) params.append('day', selectedDay);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        // Filter data based on selected criteria to ensure consistency
        const filteredData = result.data.filter(item => {
          const matchesLine = !selectedLine || item.line_name === selectedLine;
          const matchesYear = !selectedYear || item.year.toString() === selectedYear;
          const matchesMonth = !selectedMonth || item.month.toString() === selectedMonth;
          const matchesDay = !selectedDay || item.day.toString() === selectedDay;
          
          return matchesLine && matchesYear && matchesMonth && matchesDay;
        });
        
        setData(filteredData);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'HH:mm');
    } catch {
      return dateStr;
    }
  };

  // Prepare chart data for hourly consumption, ensuring hours are sorted properly
  const chartData = data
    .sort((a, b) => a.hour_of_day - b.hour_of_day)
    .map(item => ({
      hour: `${item.hour_of_day.toString().padStart(2, '0')}:00`,
      total_kwh: parseFloat(item.total_kwh),
      start_kwh: parseFloat(item.start_kwh),
      end_kwh: parseFloat(item.end_kwh),
      hour_start: formatDateTime(item.hour_start_datetime),
      hour_end: formatDateTime(item.hour_end_datetime),
      hour_of_day: item.hour_of_day
    }));

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = [
      'ID', 'PM Type', 'Line Name', 'Hour Start', 'Hour End', 'Start kWh', 'End kWh', 'Total kWh',
      'Date', 'Year', 'Month', 'Month Name', 'Day', 'Day Name', 'Hour of Day'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.idPrimary,
        row.pm_type,
        row.line_name,
        formatDateTime(row.hour_start_datetime),
        formatDateTime(row.hour_end_datetime),
        formatNumber(row.start_kwh),
        formatNumber(row.end_kwh),
        formatNumber(row.total_kwh),
        format(row.date ? new Date(row.date) : new Date(), 'yyyy-MM-dd'),
        row.year,
        row.month,
        row.month_name,
        row.day,
        row.day_name,
        row.hour_of_day
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hourly_report_${selectedYear}_${selectedMonth.padStart(2, '0')}_${selectedDay.padStart(2, '0')}_${selectedLine || 'all'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals based on filtered data
  const totalConsumption = data.reduce((sum, item) => sum + parseFloat(item.total_kwh), 0);
  const averageConsumption = data.length > 0 ? totalConsumption / data.length : 0;
  const maxConsumption = data.length > 0 ? Math.max(...data.map(item => parseFloat(item.total_kwh))) : 0;
  const minConsumption = data.length > 0 ? Math.min(...data.map(item => parseFloat(item.total_kwh))) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          backgroundColor: '#ffffff',
          border: '2px solid #e3f2fd',
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: '#1976d2', 
                fontWeight: 'bold',
                mr: 2
              }}
            >
              Hourly Energy Consumption Report
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontStyle: 'italic'
              }}
            >
              時間別エネルギー消費レポート
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Nama Line Produksi</InputLabel>
                <Select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  label="Nama Line Produksi"
                >
                  <MenuItem value="">
                    <em>All Lines</em>
                  </MenuItem>
                  {lineNames.map((line) => (
                    <MenuItem key={line} value={line}>
                      {line}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tahun</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Tahun"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Bulan</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Bulan"
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Hari</InputLabel>
                <Select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  label="Hari"
                >
                  {days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
              disabled={data.length === 0}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#43a047',
                  backgroundColor: '#f1f8e9'
                }
              }}
            >
              Export to CSV
            </Button>
          </Box>

          {/* Summary Cards */}
          {data.length > 0 && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #1976d2'
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Total Consumption
                  </Typography>
                  <Typography variant="h4" color="secondary" fontWeight="bold">
                    {formatNumber(totalConsumption)} kWh
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50'
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Average per Hour
                  </Typography>
                  <Typography variant="h4" color="secondary" fontWeight="bold">
                    {formatNumber(averageConsumption)} kWh
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: '#fff3e0',
                    border: '1px solid #ff9800'
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Max Consumption
                  </Typography>
                  <Typography variant="h4" color="secondary" fontWeight="bold">
                    {formatNumber(maxConsumption)} kWh
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336'
                  }}
                >
                  <Typography variant="h6" color="primary">
                    Total Hours
                  </Typography>
                  <Typography variant="h4" color="secondary" fontWeight="bold">
                    {data.length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Chart Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 'bold' }}>
            Hourly Energy Consumption Chart - {selectedYear}-{selectedMonth.padStart(2, '0')}-{selectedDay.padStart(2, '0')} {selectedLine ? `(${selectedLine})` : '(All Lines)'}
          </Typography>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              height: 400,
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value} kWh`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'total_kwh') return [`${value} kWh`, 'Total Consumption'];
                      if (name === 'start_kwh') return [`${value} kWh`, 'Start kWh'];
                      if (name === 'end_kwh') return [`${value} kWh`, 'End kWh'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Hour: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="total_kwh" name="Total kWh" fill="#1976d2">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.total_kwh === maxConsumption ? '#f44336' : entry.total_kwh === minConsumption ? '#4caf50' : '#1976d2'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No chart data available for the selected criteria
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Detailed Table */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 'bold' }}>
            Hourly Consumption Details - {selectedYear}-{selectedMonth.padStart(2, '0')}-{selectedDay.padStart(2, '0')} {selectedLine ? `(${selectedLine})` : '(All Lines)'}
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: 400,
              border: '1px solid #e0e0e0',
              borderRadius: 1
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderRight: '1px solid #ccc' }}>
                    Hour
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderRight: '1px solid #ccc' }}>
                    Start Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderRight: '1px solid #ccc' }}>
                    End Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderRight: '1px solid #ccc', textAlign: 'right' }}>
                    Start kWh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', borderRight: '1px solid #ccc', textAlign: 'right' }}>
                    End kWh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'right' }}>
                    Total kWh
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chartData.map((row, index) => {
                  const isMax = row.total_kwh === maxConsumption;
                  const isMin = row.total_kwh === minConsumption;
                  
                  return (
                    <TableRow 
                      key={`${row.hour_of_day}-${index}`} 
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                        '&:hover': { backgroundColor: '#e8f5e8' },
                        backgroundColor: isMax ? '#ffebee' : isMin ? '#e8f5e8' : '#f9f9f9'
                      }}
                    >
                      <TableCell sx={{ borderRight: '1px solid #eee' }}>
                        {row.hour}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid #eee' }}>
                        {row.hour_start}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid #eee' }}>
                        {row.hour_end}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid #eee', textAlign: 'right' }}>
                        {formatNumber(row.start_kwh)}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid #eee', textAlign: 'right' }}>
                        {formatNumber(row.end_kwh)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                        {formatNumber(row.total_kwh)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {data.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No data available for the selected criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected: {selectedYear}-{selectedMonth.padStart(2, '0')}-{selectedDay.padStart(2, '0')} {selectedLine ? `Line: ${selectedLine}` : 'All Lines'}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">
            Total Records: {data.length} | Selected: {selectedYear}-{selectedMonth.padStart(2, '0')}-{selectedDay.padStart(2, '0')} {selectedLine ? `| Line: ${selectedLine}` : '| All Lines'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportHourly;