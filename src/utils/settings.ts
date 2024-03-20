import type { Option } from "@/types/settings"

export const integrations: Option[] = [
  { value: null, label: "Disabled" },
  { value: "Redmine", label: "Redmine" },
]

export const getIntegration = (value: string | null): Option =>
  integrations.find((integ) => integ.value === value) as Option
