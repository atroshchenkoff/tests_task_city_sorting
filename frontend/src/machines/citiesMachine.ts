import { setup, assign, fromPromise, ActorRefFrom } from 'xstate';
import * as api from '../services/api';

export interface City {
  _id: string;
  name: string;
  foundationDate: Date;
}

type CitiesContext = {
  cities: City[];
  error: unknown;
}

type CitiesEvent =
  | { type: 'FETCH' }
  | { type: 'ADD'; city: Omit<City, '_id'> }
  | { type: 'UPDATE'; city: City }
  | { type: 'DELETE'; id: string }

export const citiesMachine = setup({
  guards: {
    hasError: ({ context }) => context.error !== null,
  },
  actors: {
    fetchCities: fromPromise(async () => api.getCities().then(response => response.data)),
    addCity: fromPromise(async ({ input }: { input: { city: Omit<City, '_id'> } }) => api.addCity(input.city).then(response => response.data)),
    updateCity: fromPromise(async ({ input }: { input: { city: City } }) => api.updateCity(input.city._id, input.city).then(response => response.data)),
    deleteCity: fromPromise(async ({ input }: { input: { id: string } }) => api.deleteCity(input.id).then(response => response.data)),
  },
}).createMachine({
  types: {} as {
    context: CitiesContext,
    events: CitiesEvent,
  },
  id: 'cities',
  initial: 'idle',
  context: {
    cities: [],
    error: null,
  },
  states: {
    idle: {
      on: { FETCH: 'loading' },
    },
    loading: {
      invoke: {
        id: 'fetchCities',
        src: 'fetchCities',
        onDone: {
          target: 'loaded',
          actions: assign({
            cities: ({ event }) => event.output,
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
        ADD: {
          target: 'adding',
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
    adding: {
      invoke: {
        id: 'addCity',
        src: 'addCity',
        input: ({ event }) => ({ city: event.city }),
        onDone: {
          target: 'loaded',
          actions: assign({
            cities: ({ context, event }) => [...context.cities, event.output],
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
        id: 'updateCity',
        src: 'updateCity',
        input: ({ event }) => ({ city: event.city }),
        onDone: {
          target: 'loaded',
          actions: assign({
            cities: ({ context, event }) =>
              context.cities.map(city =>
                city._id === event.output._id ? event.output : city
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
        id: 'deleteCity',
        src: 'deleteCity',
        input: ({ event }) => ({ id: event.id }),
        onDone: {
          target: 'loaded',
          actions: assign({
            cities: ({ context, event }) =>
              context.cities.filter(city => city._id !== event.output.id),
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

export type SendToCitiesMachineType = ActorRefFrom<typeof citiesMachine>['send'];
