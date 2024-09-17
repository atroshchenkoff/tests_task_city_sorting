import { setup, assign, fromPromise, ActorRefFrom } from 'xstate';
import * as api from '../services/api';
import { City } from './citiesMachine';

export interface NamedList {
  _id: string;
  name: string;
  shortName: string;
  color: string;
  cities: City[];
}

interface IOption {
  label: string;
  value: string;
}

interface NamedListsContext {
  cities: City[];
  formattedCities: IOption[];
  namedLists: NamedList[];
  error: unknown;
}

type NamedListsEvent =
  | { type: 'FETCH' }
  | { type: 'FETCH_CITIES' }
  | { type: 'CREATE'; list: Omit<NamedList, 'id'> }
  | { type: 'UPDATE'; list: NamedList }
  | { type: 'DELETE'; id: string };

export const namedListsMachine = setup({
  guards: {
    hasError: ({ context }) => context.error !== null,
  },
  actors: {
    fetchCities: fromPromise(async () => api.getCities().then(response => response.data)),
    fetchNamedLists: fromPromise(async () => api.getNamedLists().then(response => response.data)),
    createNamedList: fromPromise(async ({ input }: { input: { list: Omit<NamedList, '_id'> } }) => api.createNamedList(input.list).then(response => response.data)),
    updateNamedList: fromPromise(async ({ input }: { input: { list: NamedList } }) => api.updateNamedList(input.list._id, input.list).then(response => response.data)),
    deleteNamedList: fromPromise(async ({ input }: { input: { id: string } }) => api.deleteNamedList(input.id).then(response => response.data)),
  },
}).createMachine({
  types: {} as {
    context: NamedListsContext;
    events: NamedListsEvent;
  },
  id: 'namedLists',
  initial: 'idle',
  context: {
    cities: [],
    formattedCities: [],
    namedLists: [],
    error: null,
  },
  states: {
    idle: {
      on: { FETCH: 'loading' },
    },
    loading: {
      invoke: {
        id: 'fetchNamedLists',
        src: 'fetchNamedLists',
        onDone: {
          target: 'loaded',
          actions: assign({
            namedLists: ({ event }) => event.output,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    loadingCities: {
      invoke: {
        id: 'fetchCities',
        src: 'fetchCities',
        onDone: {
          target: 'loaded',
          actions: assign({
            cities: ({ event }) => event.output,
            formattedCities: ({ event }) => event.output.map(city => {
              return {
                label: city.name,
                value: city._id
              }
            }),
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    loaded: {
      on: {
        CREATE: {
          target: 'creating',
        },
        UPDATE: {
          target: 'updating',
        },
        DELETE: {
          target: 'deleting',
        },
        FETCH: 'loading',
        FETCH_CITIES: 'loadingCities',
      },
    },
    creating: {
      invoke: {
        id: 'createNamedList',
        src: 'createNamedList',
        input: ({ event }) => ({ list: event.list }),
        onDone: {
          target: 'loaded',
          actions: assign({
            namedLists: ({ context, event }) => [...context.namedLists, event.output as NamedList],
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    updating: {
      invoke: {
        id: 'updateNamedList',
        src: 'updateNamedList',
        input: ({ event }) => ({ list: event.list }),
        onDone: {
          target: 'loaded',
          actions: assign({
            namedLists: ({ context, event }) =>
              context.namedLists.map(list =>
                list._id === (event.output as NamedList)._id ? (event.output as NamedList) : list
              ),
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    deleting: {
      invoke: {
        id: 'deleteNamedList',
        src: 'deleteNamedList',
        input: ({ event }) => ({ id: event.id }),
        onDone: {
          target: 'loaded',
          actions: assign({
            namedLists: ({ context, event }) =>
              context.namedLists.filter(list => list._id !== event.output.id),
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => event.error,
          }),
        },
      },
    },
    failure: {
      on: {
        FETCH: 'loading',
      },
    },
  },
});

export type SendToNamedListsMachineType = ActorRefFrom<typeof namedListsMachine>['send'];
