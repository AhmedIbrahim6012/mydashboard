import { Box, Stack, Button } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import CustomersTable from '../../components/customers/CustomersTable';
import { useAppContext } from '../../context/AppContext';
import AddIcon from '@mui/icons-material/Add';

function CustomersPage() {
  const { customers, deleteCustomer, addCustomer } = useAppContext();

  function handleDelete(id) {
    deleteCustomer(id);
  }

  function handleAddSample() {
    addCustomer({ fullName: 'New Customer', phone: '+1 (000) 000-0000', email: null, balance: 0 });
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Customers Management" subtitle="Manage mobile app users and accounts." />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button startIcon={<AddIcon />} onClick={handleAddSample} variant="contained">
          Add sample customer
        </Button>
      </Box>

      <CustomersTable customers={customers} onDelete={handleDelete} />
    </Stack>
  );
}

export default CustomersPage;