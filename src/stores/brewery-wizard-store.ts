import { create } from "zustand";

export type BreweryDTO = {
  id: number;
  name: string;
  status: "pending" | "approved";
};

type BreweryCache = Record<number, BreweryDTO[]>;

type BreweryWizardState = {
  // cache: countryId -> breweries
  breweriesByCountry: BreweryCache;

  // loading state per country
  loadingByCountry: Record<number, boolean>;

  // actions
  setBreweries: (countryId: number, breweries: BreweryDTO[]) => void;

  setLoading: (countryId: number, loading: boolean) => void;

  // used when creating new brewery (optimistic update)
  addBrewery: (countryId: number, brewery: BreweryDTO) => void;

  clearCountry: (countryId: number) => void;
};

export const useBreweryWizardStore = create<BreweryWizardState>((set, get) => ({
  breweriesByCountry: {},
  loadingByCountry: {},

  setBreweries: (countryId, breweries) =>
    set((state) => ({
      breweriesByCountry: {
        ...state.breweriesByCountry,
        [countryId]: breweries,
      },
    })),

  setLoading: (countryId, loading) =>
    set((state) => ({
      loadingByCountry: {
        ...state.loadingByCountry,
        [countryId]: loading,
      },
    })),

  addBrewery: (countryId, brewery) =>
    set((state) => {
      const existing = state.breweriesByCountry[countryId] ?? [];

      return {
        breweriesByCountry: {
          ...state.breweriesByCountry,
          [countryId]: [brewery, ...existing],
        },
      };
    }),

  clearCountry: (countryId) =>
    set((state) => {
      const copy = { ...state.breweriesByCountry };
      delete copy[countryId];

      return { breweriesByCountry: copy };
    }),
}));
