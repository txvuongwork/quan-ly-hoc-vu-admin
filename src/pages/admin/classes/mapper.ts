import type { BadgeVariantKeys } from "@/components/ui/variants";
import { EClassStatus } from "@/enums";

export const ClassStatusVariantMapper: Record<EClassStatus, BadgeVariantKeys> =
  {
    [EClassStatus.DRAFT]: "secondary",
    [EClassStatus.OPEN_FOR_REGISTRATION]: "primary",
    [EClassStatus.CONFIRMED]: "success",
    [EClassStatus.CANCELLED]: "destructive",
    [EClassStatus.IN_PROGRESS]: "warning",
    [EClassStatus.COMPLETED]: "secondary",
  };
