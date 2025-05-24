import { create } from "zustand";
import { persist } from "zustand/middleware";
type TestCase = { given: unknown; expected: unknown };
type QuestionMap = Record<string, { tests: TestCase[] }>;

type TestStore = {
  tests: QuestionMap;
  setTests: (data: QuestionMap) => void;
  getTests: (testId: string) => Promise<TestCase[]>;
  fetchTests: () => Promise<QuestionMap>;
  getTestKeys: () => { id: string; tests: TestCase[] }[];
};

export const useTestsStore = create<TestStore>()(
  persist(
    (set, get) => ({
      tests: {},
      setTests: (data) => set({ tests: data }),

      getTests: async (testId: string): Promise<TestCase[]> => {
        let tests = get().tests[testId]?.tests;
        if (!tests) {
          await get().fetchTests();
          tests = get().tests[testId]?.tests;
        }
        return tests?.slice(0, 3) ?? [];
      },

      fetchTests: async (): Promise<QuestionMap> => {
        try {
          const res = await fetch("/data/tests.json");
          const data: QuestionMap = await res.json();
          set({ tests: data });
          return data;
        } catch (error) {
          console.error("Failed to fetch tests:", error);
          return {};
        }
      },

      getTestKeys: () => {
        const tests = get().tests;
        return Object.entries(tests).map(([id, { tests }]) => ({
          id,
          tests: tests.slice(0, 3),
        }));
      },
    }),
    {
      name: "dsa-tests",
    }
  )
);
