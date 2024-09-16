import { useMachine } from '@xstate/react';
import { namedListsMachine } from '../../machines/namedListMachine';

const NamedListPage = () => {
  const [namedListsState, sendToNamedLists] = useMachine(namedListsMachine);

  return <div>Named List Page</div>
}

export default NamedListPage
