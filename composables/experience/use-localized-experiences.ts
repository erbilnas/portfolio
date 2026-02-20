import type { Education, WorkExperience } from "~/types/experience";
import enLocale from "~/locales/en.json";
import trLocale from "~/locales/tr.json";
import jaLocale from "~/locales/ja.json";

/**
 * Extract value from Vue i18n message object
 */
function extractValue(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    // Vue i18n message object has body.static for simple strings
    if (value.body?.static) return String(value.body.static);
    // Fallback: try to get the source from loc
    if (value.loc?.source) return String(value.loc.source);
    // Fallback: try to stringify the whole object
    return String(value);
  }
  return String(value || "");
}

/**
 * Validate and normalize a work experience object
 */
function validateWorkExperience(data: any): WorkExperience | null {
  if (!data || typeof data !== "object") return null;
  
  // Extract values from Vue i18n message objects
  const company = extractValue(data.company);
  const currentPosition = extractValue(data.currentPosition);
  const period = extractValue(data.period);
  const location = extractValue(data.location);
  const description = extractValue(data.description);
  
  // Extract technologies array
  let technologies: string[] = [];
  if (Array.isArray(data.technologies)) {
    technologies = data.technologies.map((t: any) => extractValue(t));
  }
  
  if (
    company &&
    currentPosition &&
    period &&
    location &&
    description &&
    Array.isArray(technologies)
  ) {
    return {
      company,
      currentPosition,
      period,
      location,
      description,
      technologies,
    };
  }
  return null;
}

/**
 * Validate and normalize an education object
 */
function validateEducation(data: any): Education | null {
  if (!data || typeof data !== "object") return null;
  
  // Extract values from Vue i18n message objects
  const school = extractValue(data.school);
  const degree = extractValue(data.degree);
  const year = extractValue(data.year);
  const description = extractValue(data.description);
  
  // Extract achievements array
  let achievements: string[] = [];
  if (Array.isArray(data.achievements)) {
    achievements = data.achievements.map((a: any) => extractValue(a));
  }
  
  if (
    school &&
    degree &&
    year &&
    description &&
    Array.isArray(achievements)
  ) {
    return {
      school,
      degree,
      year,
      description,
      achievements,
    };
  }
  return null;
}

/**
 * Get localized work experiences from i18n
 */
export function useLocalizedWorkExperiences() {
  const i18n = useI18n();
  const { locale, tm } = i18n;
  
  return computed<WorkExperience[]>(() => {
    try {
      // Try multiple approaches to get the messages
      let experienceMessages: any = null;
      
      // Approach 1: Use tm() function
      try {
        experienceMessages = tm("experience");
      } catch (e) {
        // tm() failed, try next approach
      }
      
      // Approach 2: Access messages directly from i18n instance
      if (!experienceMessages || typeof experienceMessages !== "object") {
        const messages = (i18n as any).messages?.value?.[locale.value] || 
                         (i18n as any).localeMessages?.value?.[locale.value] ||
                         (i18n as any).$messages?.[locale.value];
        if (messages && typeof messages === "object") {
          experienceMessages = messages.experience;
        }
      }
      
      // Approach 3: Fallback to direct import (for development/debugging)
      if (!experienceMessages || typeof experienceMessages !== "object") {
        const fallbackMessages =
          locale.value === "tr"
            ? trLocale
            : locale.value === "ja"
              ? jaLocale
              : enLocale;
        experienceMessages = (fallbackMessages as any).experience;
      }
      
      if (experienceMessages && typeof experienceMessages === "object") {
        const workExperiences = experienceMessages.workExperiences;
        
        if (Array.isArray(workExperiences)) {
          // Validate and normalize each work experience
          const validated = workExperiences
            .map(validateWorkExperience)
            .filter((exp): exp is WorkExperience => exp !== null);
          
          return validated;
        }
      }
      
      console.warn("[useLocalizedWorkExperiences] No work experiences found");
    } catch (error) {
      console.error("[useLocalizedWorkExperiences] Error:", error);
    }
    
    return [];
  });
}

/**
 * Get localized education list from i18n
 */
export function useLocalizedEducationList() {
  const i18n = useI18n();
  const { locale, tm } = i18n;
  
  return computed<Education[]>(() => {
    try {
      // Try multiple approaches to get the messages
      let experienceMessages: any = null;
      
      // Approach 1: Use tm() function
      try {
        experienceMessages = tm("experience");
      } catch (e) {
        // tm() failed, try next approach
      }
      
      // Approach 2: Access messages directly from i18n instance
      if (!experienceMessages || typeof experienceMessages !== "object") {
        const messages = (i18n as any).messages?.value?.[locale.value] || 
                         (i18n as any).localeMessages?.value?.[locale.value] ||
                         (i18n as any).$messages?.[locale.value];
        if (messages && typeof messages === "object") {
          experienceMessages = messages.experience;
        }
      }
      
      // Approach 3: Fallback to direct import (for development/debugging)
      if (!experienceMessages || typeof experienceMessages !== "object") {
        const fallbackMessages =
          locale.value === "tr"
            ? trLocale
            : locale.value === "ja"
              ? jaLocale
              : enLocale;
        experienceMessages = (fallbackMessages as any).experience;
      }
      
      if (experienceMessages && typeof experienceMessages === "object") {
        const educations = experienceMessages.educations;
        
        if (Array.isArray(educations)) {
          // Validate and normalize each education
          const validated = educations
            .map(validateEducation)
            .filter((edu): edu is Education => edu !== null);
          
          return validated;
        }
      }
      
      console.warn("[useLocalizedEducationList] No educations found");
    } catch (error) {
      console.error("[useLocalizedEducationList] Error:", error);
    }
    
    return [];
  });
}

