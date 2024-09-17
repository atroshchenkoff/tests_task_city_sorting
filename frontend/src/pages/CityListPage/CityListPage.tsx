import { useMachine } from '@xstate/react';
import { citiesMachine as citiesMachineDefinition } from '../../machines/citiesMachine';
import { useEffect } from 'react';
import CityTable from '../../components/CityTable/CityTable';

const CityListPage = () => {
  const [citiesMachine, sendToCitiesMachine] = useMachine(citiesMachineDefinition);

  const { cities } = citiesMachine.context;

  const isLoadingCityList = citiesMachine.matches('loading');

  useEffect(() => {
    sendToCitiesMachine({ type: 'FETCH' });
  }, []);

  return (
    <CityTable
      isLoadingCityList={isLoadingCityList}
      cities={cities}
      sendToCitiesMachine={sendToCitiesMachine}
    />
  )
}

export default CityListPage
