import { computed, type ComputedRef, type Ref } from "vue";
import type { TimelineItem } from "~/types/experience";
import { parseDate, parseYear } from "./date-parsing";
import {
  useLocalizedEducationList,
  useLocalizedWorkExperiences,
} from "./use-localized-experiences";

/**
 * Get the start date of a timeline item
 */
function getStartDate(item: TimelineItem): Date | null {
  if (item.type === "experience") {
    const period = item.data.period;
    if (typeof period !== "string") return null;
    const parts = period.split(" - ");
    if (parts.length !== 2) return null;
    return parseDate(parts[0].trim());
  } else {
    const year = item.data.year;
    if (typeof year !== "string") return null;
    return parseYear(year);
  }
}

/**
 * Get sorted work experience items (most recent first)
 */
export function useWorkExperienceItems() {
  const experiences = useLocalizedWorkExperiences();
  
  return computed<TimelineItem[]>(() => {
    const items: TimelineItem[] = experiences.value.map((exp) => ({
      type: "experience" as const,
      data: exp,
    }));

    // Sort by start date (most recent first)
    return items.sort((a, b) => {
      const dateA = getStartDate(a);
      const dateB = getStartDate(b);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Get sorted education items (most recent first)
 */
export function useEducationItems() {
  const educationList = useLocalizedEducationList();
  
  return computed<TimelineItem[]>(() => {
    const items: TimelineItem[] = educationList.value.map((edu) => ({
      type: "education" as const,
      data: edu,
    }));

    // Sort by start date (most recent first)
    return items.sort((a, b) => {
      const dateA = getStartDate(a);
      const dateB = getStartDate(b);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB.getTime() - dateA.getTime();
    });
  });
}

/**
 * Get timeline items based on active tab
 */
export function useTimelineItems(activeTabKey: Ref<"workExperience" | "education">) {
  const workExperienceItems = useWorkExperienceItems();
  const educationItems = useEducationItems();

  return computed<TimelineItem[]>(() => {
    return activeTabKey.value === "workExperience"
      ? workExperienceItems.value
      : educationItems.value;
  });
}

/**
 * Transform timeline items into Timeline component format
 */
export function useTimelineItemsForComponent(
  timelineItems: ComputedRef<TimelineItem[]>
) {
  return computed(() => {
    return timelineItems.value.map((item, index) => {
      const id =
        item.type === "experience"
          ? `exp-${item.data.company}-${index}`
          : `edu-${item.data.school}-${index}`;
      const label =
        item.type === "experience" ? item.data.company : item.data.school;
      return { id, label };
    });
  });
}

/**
 * Create items with slot names for template iteration
 */
export function useTimelineItemsWithSlots(
  timelineItems: ComputedRef<TimelineItem[]>
) {
  return computed(() => {
    return timelineItems.value.map((item, index) => ({
      item,
      slotName:
        item.type === "experience"
          ? `exp-${item.data.company}-${index}`
          : `edu-${item.data.school}-${index}`,
    }));
  });
}
