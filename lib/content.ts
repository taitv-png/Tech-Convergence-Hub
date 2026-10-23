// Localized views of the site data. Ids, room codes, floors, theme ids and cluster keys are
// shared; only display text changes with the locale.
import { allSpaces, clusterKeyByName, clusters, floorLabels, labs, news, type Lab } from "@/data/labs";
import { technologyThemes } from "@/data/technology-themes";
import { operatingModels } from "@/data/operating-models";
import { clustersEn, floorRolesEn, labsEn, modelsEn, newsEn, themesEn } from "@/data/content-en";
import type { Locale } from "./i18n";

export type LocalLab = Lab & {
  clusterName: string;
  // Vietnamese and English text together, so search works in either language.
  searchText: string;
};

export type LocalCluster = { key: string; code: string; name: string; desc: string; tags: string[] };

const viFloorRole = (floor: string) =>
  floorLabels[floor]?.split(/\s[–-]\s/).slice(1).join(" - ") ?? "";

export function floorRole(locale: Locale, floor: string): string {
  return locale === "en" ? floorRolesEn[floor] ?? "" : viFloorRole(floor);
}

export function getClusters(locale: Locale): LocalCluster[] {
  return clusters.map((cluster) => {
    const en = clustersEn[cluster.key];
    return locale === "en" && en
      ? { key: cluster.key, code: cluster.code, name: en.name, desc: en.desc, tags: en.tags }
      : { key: cluster.key, code: cluster.code, name: cluster.name, desc: cluster.desc, tags: cluster.tags };
  });
}

export function clusterName(locale: Locale, key: string): string {
  if (locale === "en") return clustersEn[key]?.name ?? key;
  return clusters.find((cluster) => cluster.key === key)?.name ?? key;
}

// Accept a stable key, or an old Vietnamese cluster name from earlier links.
export function resolveClusterKey(value: string | null): string {
  if (!value) return "";
  if (clusters.some((cluster) => cluster.key === value)) return value;
  return clusterKeyByName[value] ?? "";
}

const enCapabilities = (cluster: string) => [
  `Develop and test solutions within the ${cluster} cluster`,
  "Integrate shared data, equipment and simulation platforms",
  "Support hands-on training and interdisciplinary research",
  "Conduct field trials using a living lab approach and support technology transfer",
];
const enAudiences = ["Students", "Postgraduate students", "Researchers", "Businesses and local partners"];
const enOutcomes = [
  "Applied research projects",
  "Prototypes and demonstration models",
  "Short hands-on training programmes",
  "Technology transfer projects",
];

function localize(lab: Lab, locale: Locale): LocalLab {
  const en = labsEn[lab.id];
  const enClusterName = clustersEn[lab.clusterKey]?.name ?? lab.cluster;
  const searchText = [
    lab.name,
    lab.desc,
    lab.room,
    lab.cluster,
    ...lab.tech,
    ...lab.apps,
    en?.name ?? "",
    en?.desc ?? "",
    enClusterName,
    ...(en?.tech ?? []),
    ...(en?.apps ?? []),
  ].join(" ");
  if (locale === "vi" || !en) return { ...lab, clusterName: lab.cluster, searchText };
  return {
    ...lab,
    name: en.name,
    desc: en.desc,
    tech: en.tech,
    apps: en.apps,
    intro: en.desc,
    sourceQuote: en.desc,
    capabilities: enCapabilities(enClusterName),
    audiences: enAudiences,
    outcomes: enOutcomes,
    clusterName: enClusterName,
    searchText,
  };
}

// Listed labs (classrooms excluded) and every room (for the map and the record).
export const getLabs = (locale: Locale) => labs.map((lab) => localize(lab, locale));
export const getAllSpaces = (locale: Locale) => allSpaces.map((lab) => localize(lab, locale));
export const getLab = (locale: Locale, id: string) => {
  const lab = labs.find((item) => item.id === id);
  return lab ? localize(lab, locale) : undefined;
};

export function getThemes(locale: Locale) {
  const names: Record<string, string> = {
    iot: "Internet of Things (IoT)", immersive: "Immersive Technology", ocean: "Ocean Technology",
    materials: "Materials", cyber: "Cybersecurity", ux: "User Experience (UX)",
  };
  return technologyThemes.map((theme) => ({
    ...theme,
    name: locale === "en" ? names[theme.id] ?? theme.name : theme.name,
    description: locale === "en" ? themesEn[theme.id] ?? theme.description : theme.description,
  }));
}

export function getModels(locale: Locale) {
  return operatingModels.map((model) => (locale === "en" ? { ...model, ...modelsEn[model.id] } : model));
}

export function getNews(locale: Locale) {
  return locale === "en" ? newsEn : news;
}

export const floorCount = Object.keys(floorLabels).length;
