import { create } from "zustand";

export type BeerStyleDTO = {
  id: number;
  name: string;
  status: "pending" | "approved" | "rejected";
};

type BeerStyleState = {
  beerStyles: BeerStyleDTO[];
  loading: boolean;

  setBeerStyles: (styles: BeerStyleDTO[]) => void;
  setLoading: (loading: boolean) => void;

  addBeerStyle: (style: BeerStyleDTO) => void;
};

export const useBeerStyleWizardStore = create<BeerStyleState>((set) => ({
  beerStyles: [],
  loading: false,

  setBeerStyles: (styles) =>
    set(() => ({
      beerStyles: styles,
    })),

  setLoading: (loading) =>
    set(() => ({
      loading,
    })),

  addBeerStyle: (style) =>
    set((state) => {
      const exists = state.beerStyles.some((s) => s.id === style.id);
      if (exists) return state;

      return {
        beerStyles: [style, ...state.beerStyles],
      };
    }),
}));
