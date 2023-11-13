import type { Option } from "@/types/settings";

export const integrations: Option[] = [
  { value: "", label: "Disabled" },
  { value: "redmine", label: "Redmine" },
];

export const getIntegration = (value: string): Option =>
  integrations.find((integ) => integ.value === value) as Option;
