import { useMachine } from '@xstate/react';
import { namedListsMachine as namedListsMachineDefinition } from '../../machines/namedListMachine';
import { useEffect } from 'react';
import { NamedListTable } from '../../components/NamedListTable/NamedListTable';

const NamedListPage = () => {
  const [namedListsMachine, sendToNamedListsMachine] = useMachine(namedListsMachineDefinition);

  const { namedLists, formattedCities } = namedListsMachine.context;

  const isLoadingNamedList = namedListsMachine.matches('loading');
  const isRemovingNamedList = namedListsMachine.matches('deleting');

  useEffect(() => {
    sendToNamedListsMachine({ type: 'FETCH' });
  }, []);

  return (
    <NamedListTable
      namedLists={namedLists}
      isLoadingNamedList={isLoadingNamedList}
      isRemovingNamedList={isRemovingNamedList}
      formattedCities={formattedCities}
      sendToNamedListsMachine={sendToNamedListsMachine}
    />
  )
}

export default NamedListPage
