import { setup, assign } from 'xstate';
import * as api from '../services/api';

interface NamedList {
  id: string;
  name: string;
  shortName: string;
  cities: string[]; // array of city IDs
}

interface NamedListsContext {
  namedLists: NamedList[];
  error: string | null;
}

type NamedListsEvent =
  | { type: 'FETCH' }
  | { type: 'CREATE'; list: Omit<NamedList, 'id'> }
  | { type: 'UPDATE'; list: NamedList }
  | { type: 'DELETE'; id: string };

export const namedListsMachine = setup({
  types: {} as {
    context: NamedListsContext;
    events: NamedListsEvent;
  },
  actions: {
    assignNamedLists: assign({
      namedLists: (_, event) => event.data,
    }),
    assignError: assign({
      error: (_, event) => event.data.message,
    }),
    addNamedList: assign({
      namedLists: (context, event) => [...context.namedLists, event.list as NamedList],
    }),
    updateNamedList: assign({
      namedLists: (context, event) => 
        context.namedLists.map(list => 
          list.id === (event.list as NamedList).id ? (event.list as NamedList) : list
        ),
    }),
    deleteNamedList: assign({
      namedLists: (context, event) => 
        context.namedLists.filter(list => list.id !== event.id),
    }),
  },
  guards: {
    hasError: (context) => context.error !== null,
  },
  actors: {
    fetchNamedLists: () => api.getNamedLists().then(response => response.data),
    createNamedList: (_, event) => api.createNamedList(event.list),
    updateNamedList: (_, event) => api.updateNamedList(event.list.id, event.list),
    deleteNamedList: (_, event) => api.deleteNamedList(event.id),
  },
}).createMachine({
  id: 'namedLists',
  initial: 'idle',
  context: {
    namedLists: [],
    error: null,
  },
  states: {
    idle: {
      on: { FETCH: 'loading' },
    },
    loading: {
      invoke: {
        src: 'fetchNamedLists',
        onDone: {
          target: 'loaded',
          actions: 'assignNamedLists',
        },
        onError: {
          target: 'failure',
          actions: 'assignError',
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
      },
    },
    creating: {
      invoke: {
        src: 'createNamedList',
        onDone: {
          target: 'loaded',
          actions: 'addNamedList',
        },
        onError: {
          target: 'failure',
          actions: 'assignError',
        },
      },
    },
    updating: {
      invoke: {
        src: 'updateNamedList',
        onDone: {
          target: 'loaded',
          actions: 'updateNamedList',
        },
        onError: {
          target: 'failure',
          actions: 'assignError',
        },
      },
    },
    deleting: {
      invoke: {
        src: 'deleteNamedList',
        onDone: {
          target: 'loaded',
          actions: 'deleteNamedList',
        },
        onError: {
          target: 'failure',
          actions: 'assignError',
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
