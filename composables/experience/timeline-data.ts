import { computed, type ComputedRef, type Ref } from "vue";
import { educationList, experiences } from "~/constants/experience";
import type { TimelineItem } from "~/types/experience";
import { parseDate, parseYear } from "./date-parsing";

/**
 * Get the start date of a timeline item
 */
function getStartDate(item: TimelineItem): Date | null {
  if (item.type === "experience") {
    const parts = item.data.period.split(" - ");
    if (parts.length !== 2) return null;
    return parseDate(parts[0].trim());
  } else {
    return parseYear(item.data.year);
  }
}

/**
 * Get sorted work experience items (most recent first)
 */
export function useWorkExperienceItems() {
  return computed<TimelineItem[]>(() => {
    const items: TimelineItem[] = experiences.map((exp) => ({
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
  return computed<TimelineItem[]>(() => {
    const items: TimelineItem[] = educationList.map((edu) => ({
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
export function useTimelineItems(activeTab: Ref<string>) {
  const workExperienceItems = useWorkExperienceItems();
  const educationItems = useEducationItems();

  return computed<TimelineItem[]>(() => {
    return activeTab.value === "Work Experience"
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
