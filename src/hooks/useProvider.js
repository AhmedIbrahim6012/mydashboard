import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function useProvider() {
  const { ProviderId } = useParams();
  const { Providers } = useAppContext();

  const Provider = useMemo(
    () => Providers.find((entry) => entry.id === ProviderId),
    [ProviderId, Providers],
  );

  return {
    ProviderId,
    Provider,
  };
}
