import { useMemo, useState,useEffect } from 'react';
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
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProfessionDialog from '../components/ProfessionDialog';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { Menu } from '@mui/material';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
function ProfessionsPage() {
  const navigate = useNavigate();
  const { professions, workers, addProfession, updateProfession ,setProfessions, notify } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState(null);
  const [search, setSearch] = useState('');
const [loading, setLoading] = useState(false);

const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [displayProfessions, setDisplayProfessions] = useState([]);
  // عدّل الـ enrichedProfessions
const enrichedProfessions = useMemo(
  () =>
    displayProfessions.map((p) => ({
      ...p,
      workerCount: workers.filter((w) => w.professionId === p.id).length,
    })),
  [displayProfessions, workers],
);

 
  const summaryCards = useMemo(() => {
    const totalWorkers = workers.length;
    const avgCommission = professions.length ? `${(professions.reduce((s, x) => s + Number(x.commission || 0), 0) / professions.length).toFixed(1)}%` : '—';

    return [
      { label: t('professions.summary.total', { defaultValue: 'Total professions' }), value: professions.length, helper: t('professions.summary.totalHelp', { defaultValue: 'Categories available' }) },
      { label: t('professions.summary.workers', { defaultValue: 'Total workers' }), value: totalWorkers, helper: t('professions.summary.workersHelp', { defaultValue: 'Workers across categories' }) },
      { label: t('professions.summary.avgCommission', { defaultValue: 'Average commission' }), value: avgCommission, helper: t('professions.summary.avgCommissionHelp', { defaultValue: 'Across all professions' }) },
    ];
  }, [professions, workers, t]);

  function openAddDialog() {
    setActiveProfession(null);
    setDialogOpen(true);
  }

  function openEditDialog(profession) {
    setActiveProfession(profession);
    setDialogOpen(true);
  }

  async function handleSubmit(values) {
  try {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('commission', Number(values.commission));
    if (values.imageFile) {
      formData.append('image', values.imageFile); // ← File object مو base64
    }
        console.log('imageFile:', values.imageFile); // ← تحقق إذا واصل

 for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
   
    if (activeProfession) {
      // UPDATE
      const updateForm = new FormData();
      updateForm.append('category_id', activeProfession.id);
      updateForm.append('name', values.name);
      if (values.commission) updateForm.append('commission', Number(values.commission));
      if (values.imageFile) updateForm.append('image', values.imageFile);

      const response = await api.post('/admin/category/update-category', updateForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data.data;
      updateProfession(activeProfession.id, {
        name: data.name,
        commission: data.commission,
        image: data.image_url,
        is_active: data.is_active,
      });
    }
    // creat 
    else {
      const response = await api.post('/admin/category/create-category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data.data;
      addProfession({
        ...values,
        id: data.id,
        image: data.image_url,
      });
    }

    setDialogOpen(false);
  } catch (err) {
     console.error('Error details:', err.response?.data);
  }
}
useEffect(() => {
  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await api.get('/admin/category/all-categories');
      const mapped = response.data.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        commission: cat.commission,
        image: cat.image_url,
        is_active: cat.is_active,
      }));
      setProfessions(mapped);
      setDisplayProfessions(mapped); // ← أضف هذا
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchCategories();
}, []);
useEffect(() => {
  if (!search.trim()) {
    setDisplayProfessions(professions); // ← رجع الكل
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      const response = await api.get(`/admin/category/search?query=${search.trim()}`);
      const mapped = response.data.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        commission: cat.commission,
        image: cat.image_url,
        is_active: cat.is_active,
      }));
      setDisplayProfessions(mapped); // ← حدث العرض بس مو الـ professions
    } catch (err) {
      console.error(err);
    }
  }, 500);

  return () => clearTimeout(timeout);
}, [search, professions]);
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
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('professions.title')}
        subtitle={t('professions.subtitle')}
        actions={
          <Button startIcon={<AddRoundedIcon />} variant="contained" size="large" onClick={openAddDialog}>
            {t('professions.add')}
          </Button>
        }
      />

      <Grid container spacing={2.25}>
        {summaryCards.map((card) => (
          <Grid key={card.label} item xs={12} sm={6}>
            <Card
              elevation={0}
              sx={(theme) => ({
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
              })}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={0.75}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.helper}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        })}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={7}>
                <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search professions or commission...' })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                {/* reserved for future filters */}
              </Grid>
            </Grid>

            <Divider />

            <Stack spacing={1.75}>
             {enrichedProfessions.length ? (
  enrichedProfessions.map((profession) => (
                  <Card
                    key={profession.id}
                    elevation={0}
                    sx={(theme) => ({
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.default,
                      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[6],
                        borderColor: theme.palette.primary.light,
                      },
                    })}
                  >
                    <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                      <Stack spacing={2.25} direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                          <Avatar
                            sx={(theme) => ({
                              width: 72,
                              height: 72,
                              fontSize: 28,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.dark,
                              fontWeight: 800,
                            })}
                          >
                            {profession.image ? (
                              // eslint-disable-next-line jsx-a11y/img-redundant-alt
                              <img src={profession.image} alt="profession" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (profession.name || '').slice(0, 1)
                            )}
                          </Avatar>

                          <Box>
                            <Stack spacing={0.75}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                                  {profession.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                                  {profession.workerCount} {t('professions.workersShort', { defaultValue: 'workers' })}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                <Chip size="small" icon={<GroupsIcon />} label={`${profession.workerCount} ${t('professions.workersShort', { defaultValue: 'workers' })}`} />
                                <Chip size="small" icon={<MonetizationOnIcon />} label={`${Number(profession.commission || 0)}% ${t('professions.commission')}`} />
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>

                      <Stack direction="row" spacing={0.75} alignItems="center">
  <Chip
    size="small"
    label={profession.is_active ? 'Active' : 'Inactive'}
    color={profession.is_active ? 'success' : 'default'}
    sx={{ fontWeight: 700 }}
  />
  <IconButton
    onClick={() => navigate(`/professions/${profession.id}`, { state: { profession } })}
  >
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
                <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
                  <CardContent>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {t('professions.emptyTitle', { defaultValue: 'No job categories yet' })}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {t('professions.emptySubtitle', { defaultValue: 'Create your first profession to start grouping workers.' })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Menu
  anchorEl={menuAnchor}
  open={Boolean(menuAnchor)}
  onClose={handleMenuClose}
  PaperProps={{ sx: { borderRadius: 3, minWidth: 180 } }}
>
  <MenuItem
  onClick={async () => {
    try {
      const action = menuProfession.is_active ? 'deactivate' : 'activate';
      await api.post(`/admin/category/${menuProfession.id}/${action}`);
      
      setProfessions((prev) =>
        prev.map((p) =>
          p.id === menuProfession.id ? { ...p, is_active: !p.is_active } : p
        )
      );

      notify({
        severity: 'success',
        title: menuProfession.is_active ? 'Deactivated' : 'Activated',
        message: `${menuProfession.name} has been ${menuProfession.is_active ? 'deactivated' : 'activated'} successfully.`,
      });
    } catch (err) {
      console.error('Toggle error:', err.response?.data);
      notify({ severity: 'error', title: 'Error', message: 'Failed to update status.' });
    } finally {
      handleMenuClose();
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
<Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: 360 } }}
>
  <DialogContent>
    <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
      <Box sx={(theme) => ({
        width: 64, height: 64, borderRadius: '50%',
        bgcolor: theme.palette.error.light + '22',
        display: 'grid', placeItems: 'center',
      })}>
        <DeleteOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
      </Box>
      <Typography variant="h6" fontWeight={800}>Delete Profession</Typography>
      <Typography color="text.secondary" textAlign="center">
        Are you sure you want to delete <strong>{menuProfession?.name}</strong>? This action cannot be undone.
      </Typography>
    </Stack>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
    <Button
      fullWidth
      variant="outlined"
      onClick={() => setDeleteDialogOpen(false)}
      sx={{ borderRadius: 3 }}
    >
      Cancel
    </Button>
    <Button
      fullWidth
      variant="contained"
      color="error"
      sx={{ borderRadius: 3 }}
      onClick={async () => {
        try {
          await api.delete(`/admin/category/delete-category/${menuProfession.id}`);
          setProfessions((prev) => prev.filter((p) => p.id !== menuProfession.id));
          notify({ severity: 'success', title: 'Deleted', message: `${menuProfession.name} was deleted successfully.` });
        } catch (err) {
          console.error('Delete error:', err.response?.data);
          notify({ severity: 'error', title: 'Error', message: 'Failed to delete profession.' });
        } finally {
          setDeleteDialogOpen(false);
          handleMenuClose();
        }
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

      <ProfessionDialog open={dialogOpen} profession={activeProfession} onClose={() => setDialogOpen(false)} onSubmit={handleSubmit} />
    </Stack>
  );
}

export default ProfessionsPage;
