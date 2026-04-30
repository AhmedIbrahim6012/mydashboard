import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function useWorker() {
  const { workerId } = useParams();
  const { workers } = useAppContext();

  const worker = useMemo(
    () => workers.find((entry) => entry.id === workerId),
    [workerId, workers],
  );

  return {
    workerId,
    worker,
  };
}
