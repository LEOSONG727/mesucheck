import type { Complex } from "@/types/maesucheck";

export function filterComplexes(complexes: Complex[], query: string): Complex[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return complexes.slice(0, 3);
  }

  return complexes.filter((complex) => {
    const haystack = `${complex.name} ${complex.dong} ${complex.sigungu}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
