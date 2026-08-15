

import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Menu,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PageHeader from '../components/PageHeader';
import ProfessionDialog from '../components/ProfessionDialog';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import { useAppContext } from '../context/AppContext';
import api from '../utils/axiosInstance';

function ProfessionsPage() {
  const navigate = useNavigate();
  const { setProfessions, notify } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);
  const isFirstRun = useRef(true);
  const initialLoadRef = useRef(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayProfessions, setDisplayProfessions] = useState([]);

  const [statusFilter, setStatusFilter] = useState('all');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [analytics, setAnalytics] = useState({ total: 0, active: 0, inactive: 0 });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  

  

  function openAddDialog() {
    setActiveProfession(null);
    setDialogOpen(true);
  }

  function openEditDialog(profession) {
    setActiveProfession(profession);
    setDialogOpen(true);
  }

  async function fetchCategories({ pageNum = page, status = statusFilter, query = search, silent = false } = {}) {
    try {
      const hasQuery = query.trim().length > 0;

      if (!silent) {
        if (initialLoadRef.current) {
          setLoading(true);
        } else {
          setSearchLoading(true);
        }
      }

      // const params = { page: pageNum };
      // if (status !== 'all') {
      //   params.is_active = status === 'active' ? 1 : 0;
      // }

      // let response;
      // if (hasQuery) {
      //   response = await api.get('/admin/category/search', {
      //     params: { query: query.trim(), ...params },
      //   });
      // } else {
      //   response = await api.get('/admin/category/all-categories', { params });
      // }

      const params = { page: pageNum };
if (status !== 'all') {
  params.is_active = status === 'active' ? 1 : 0;
}
if (hasQuery) {
  params.query = query.trim();
}

const response = await api.get('/admin/category/all-categories', { params });

      const payload = response.data.data;
      const list = Array.isArray(payload) ? payload : payload.data ?? [];

      const mapped = list.map((cat) => ({
        id: cat.id,
        name: cat.name,
        commission: cat.commission,
        image: typeof cat.image === 'string' ? cat.image : cat.image?.image_url || null,
        is_active: cat.is_active,
          providers_count: cat.providers_count ?? 0,   // ⬅️ إضافة جديدة

      }));

      setDisplayProfessions(mapped);
      if (!hasQuery) {
        setProfessions(mapped);
      }

      if (!Array.isArray(payload)) {
        setTotal(payload.total ?? mapped.length);
        setLastPage(payload.last_page ?? 1);
        setPage(payload.current_page ?? pageNum);
      } else {
        setTotal(mapped.length);
        setLastPage(1);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      initialLoadRef.current = false;
    }
  }

  async function fetchAnalytics(silent = false) {
    try {
      if (!silent) setAnalyticsLoading(true);
      const res = await api.get('/admin/analytics/categories');
      const d = res.data.data;
      setAnalytics({
        total: d.total_categories ?? 0,
        active: d.active_categories ?? 0,
        inactive: d.inactive_categories ?? 0,
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const delay = search.trim() ? 500 : 0;
    debounceRef.current = setTimeout(() => {
      fetchCategories({ pageNum: page, status: statusFilter, query: search });
      isFirstRun.current = false;
    }, delay);

    return () => clearTimeout(debounceRef.current);
  }, [page, statusFilter, search]);

  async function handleSubmit(values) {
    setLoadingAction({ type: activeProfession ? 'edit' : 'add' });
    let result = null;
    try {
      if (activeProfession) {
        const updateForm = new FormData();
        updateForm.append('category_id', activeProfession.id);
        updateForm.append('name', values.name);
        if (values.commission) updateForm.append('commission', Number(values.commission));
        if (values.imageFile) updateForm.append('image', values.imageFile);

        await api.post('/admin/category/update-category', updateForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        result = {
          severity: 'success',
          title: 'Profession updated',
          message: `${values.name} was updated successfully.`,
        };
      } else {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('commission', Number(values.commission));
        if (values.imageFile) {
          formData.append('image', values.imageFile);
        }

        await api.post('/admin/category/create-category', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        result = {
          severity: 'success',
          title: 'Profession added',
          message: `${values.name} was added to the system.`,
        };
      }

      setDialogOpen(false);
      await Promise.all([
        fetchCategories({ pageNum: page, status: statusFilter, query: search, silent: true }),
        fetchAnalytics(true),
      ]);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      result = { severity: 'error', message: 'Something went wrong.' };
    } finally {
      setLoadingAction(null);
      if (result) notify(result);
    }
  }

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProfession, setMenuProfession] = useState(null);

  function handleMenuOpen(event, profession) {
    setMenuAnchor(event.currentTarget);
    setMenuProfession(profession);
  }

  function handleMenuClose() {
    setMenuAnchor(null);
    setMenuProfession(null);
  }

  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'} sx={{ width: '100%' }}>
      <PageHeader
        title={t('professions.title')}
        subtitle={t('professions.subtitle')}
        actions={
          <Button startIcon={<AddRoundedIcon />} variant="contained" size="large" onClick={openAddDialog}>
            {t('professions.add')}
          </Button>
        }
      />

      {/* Analytics Grid Fixed with Box Flex */}
      <Box sx={{ display: 'flex', gap: 2.25, flexWrap: 'wrap', width: '100%' }}>
        {[
          { title: t('professions.summary.total', { defaultValue: 'Total Professions' }), value: analytics.total, caption: t('professions.summary.totalHelp', { defaultValue: 'Categories available' }), icon: <CategoryIcon />, tone: 'neutral' },
          { title: t('professions.summary.active', { defaultValue: 'Active Professions' }), value: analytics.active, caption: t('professions.summary.activeHelp', { defaultValue: 'Currently active' }), icon: <CheckCircleOutlineIcon />, tone: 'positive' },
          { title: t('professions.summary.inactive', { defaultValue: 'Inactive Professions' }), value: analytics.inactive, caption: t('professions.summary.inactiveHelp', { defaultValue: 'Currently inactive' }), icon: <HighlightOffIcon />, tone: 'warning' }
        ].map((metric, idx) => (
          <Box key={idx} sx={{ flex: '1 1 300px', minWidth: '280px' }}>
            {analyticsLoading ? (
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            ) : (
              <DashboardMetricCard
                title={metric.title}
                value={metric.value}
                caption={metric.caption}
                icon={metric.icon}
                captionTone={metric.tone}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Main Container */}
      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          width: '100%'
        })}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
  {/* تجميع البحث مع الفلاتر بجانب بعضهما */}
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
    <TextField
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search...' })}
      size="small"
      sx={{ 
        width: { xs: '100%', sm: 260 },
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: 1.5,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" color="action" />
          </InputAdornment>
        ),
      }}
    />

    {/* أزرار الفلترة ملاصقة لمربع البحث */}
    <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
      <Chip
        label={t('professions.filter.all', { defaultValue: 'All' })}
        onClick={() => setStatusFilter('all')}
        color={statusFilter === 'all' ? 'primary' : 'default'}
        variant={statusFilter === 'all' ? 'filled' : 'outlined'}
        clickable
        size="small"
        sx={{ borderRadius: 1, height: 36, px: 1 }}
      />
      <Chip
        label={t('professions.filter.active', { defaultValue: 'Active' })}
        onClick={() => setStatusFilter('active')}
        color={statusFilter === 'active' ? 'success' : 'default'}
        variant={statusFilter === 'active' ? 'filled' : 'outlined'}
        clickable
        size="small"
        sx={{ borderRadius: 1, height: 36, px: 1 }}
      />
      <Chip
        label={t('professions.filter.inactive', { defaultValue: 'Inactive' })}
        onClick={() => setStatusFilter('inactive')}
        color={statusFilter === 'inactive' ? 'warning' : 'default'}
        variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
        clickable
        size="small"
        sx={{ borderRadius: 1, height: 36, px: 1 }}
      />
    </Stack>
  </Stack>
</Box>

            <Divider />

            {/* List items / Skeleton */}
            <Stack spacing={1.75}>
              {(loading || searchLoading || loadingAction?.type === 'activate' || loadingAction?.type === 'deactivate' || loadingAction?.type === 'delete') ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 2 }} />
                ))
              ) : displayProfessions.length ? (
                displayProfessions.map((profession) => (
                  <Card
                    key={profession.id}
                    elevation={0}
                    sx={(theme) => ({
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.default,
                      
                      transition: 'transform 160ms ease, box-shadow 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                        borderColor: theme.palette.primary.light,

                      },
                    })}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: '100%' }}>
                          <Avatar
                            sx={(theme) => ({
                              width: 60,
                              height: 60,
                              fontSize: 24,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.dark,
                              fontWeight: 800,
                            })}
                          >
                            {profession.image ? (
                              <img src={profession.image} alt="profession" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (profession.name || '').slice(0, 1)
                            )}
                          </Avatar>

                          <Box>
                            <Stack spacing={0.5}>
                              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                                {profession.name}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
<Chip size="small" icon={<GroupsIcon />} label={`${profession.providers_count} ${t('professions.ProvidersShort', { defaultValue: 'Providers' })}`} />                                <Chip size="small" label={`${Number(profession.commission || 0)} ${t('professions.commission')}`} />
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end' }}>
                          <Chip
                            size="small"
                            label={profession.is_active ? 'Active' : 'Inactive'}
                            color={profession.is_active ? 'success' : 'default'}
                            sx={{ fontWeight: 700, borderRadius: 0.5 }}
                          />
                          <IconButton onClick={() => navigate(`/professions/${profession.id}`, { state: { profession } })}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => openEditDialog(profession)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={(e) => handleMenuOpen(e, profession)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card elevation={0} sx={(theme) => ({ borderRadius: 2, border: `1px solid ${theme.palette.divider}` })}>
                  <CardContent sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {t('professions.emptyTitle', { defaultValue: 'No job categories yet' })}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {t('professions.emptySubtitle', { defaultValue: 'Create your first profession to start grouping Providers.' })}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Stack>

            {/* Pagination */}
            {total > 0 && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems="center"
                justifyContent="space-between"
                sx={{ pt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('professions.showing', {
                    defaultValue: 'Showing {{count}} of {{total}}',
                    count: displayProfessions.length,
                    total,
                  })}
                </Typography>

                {lastPage > 1 && (
                  <Pagination
                    count={lastPage}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                )}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Menu Options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
      >
        <MenuItem
          onClick={async () => {
            handleMenuClose();
            setLoadingAction({ type: menuProfession.is_active ? 'deactivate' : 'activate' });
            let result = null;
            try {
              const action = menuProfession.is_active ? 'deactivate' : 'activate';
              await api.post(`/admin/category/${menuProfession.id}/${action}`);
              await Promise.all([
                fetchCategories({ pageNum: page, status: statusFilter, query: search, silent: true }),
                fetchAnalytics(),
              ]);

              result = {
                severity: 'success',
                title: menuProfession.is_active ? 'Deactivated' : 'Activated',
                message: `${menuProfession.name} has been ${menuProfession.is_active ? 'deactivated' : 'activated'} successfully.`,
              };
            } catch (err) {
              console.error('Toggle error:', err.response?.data);
              result = { severity: 'error', title: 'Error', message: 'Failed to update status.' };
            } finally {
              setLoadingAction(null);
              if (result) notify(result);
            }
          }}
          sx={{ gap: 1.5 }}
        >
          {menuProfession?.is_active ? (
            <><ToggleOffIcon color="warning" /> Deactivate</>
          ) : (
            <><ToggleOnIcon color="success" /> Activate</>
          )}
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          sx={{ gap: 1.5, color: 'error.main' }}
        >
          <DeleteOutlineIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 320 } }}
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
            <Box sx={(theme) => ({
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: theme.palette.error.light + '22',
              display: 'grid', placeItems: 'center',
            })}>
              <DeleteOutlineIcon sx={{ fontSize: 28, color: 'error.main' }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>Delete Profession</Typography>
            <Typography color="text.secondary" textAlign="center">
              Are you sure you want to delete <strong>{menuProfession?.name}</strong>?
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button fullWidth variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={async () => {
              setDeleteDialogOpen(false);
              setLoadingAction({ type: 'delete' });
              let result = null;
              try {
                await api.delete(`/admin/category/delete-category/${menuProfession.id}`);
                result = { severity: 'success', title: 'Deleted', message: `${menuProfession.name} was deleted successfully.` };

                const willBeEmpty = displayProfessions.length === 1 && page > 1;
                const targetPage = willBeEmpty ? page - 1 : page;
                if (willBeEmpty) {
                  setPage(targetPage);
                } else {
                  await fetchCategories({ pageNum: targetPage, status: statusFilter, query: search, silent: true });
                }
                await fetchAnalytics();
              } catch (err) {
                console.error('Delete error:', err.response?.data);
                result = { severity: 'error', title: 'Error', message: 'Failed to delete profession.' };
              } finally {
                setLoadingAction(null);
                handleMenuClose();
                if (result) notify(result);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ProfessionDialog
        open={dialogOpen}
        profession={activeProfession}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        loading={loadingAction?.type === 'edit' || loadingAction?.type === 'add'}
      />
    </Stack>
  );
}

export default ProfessionsPage;