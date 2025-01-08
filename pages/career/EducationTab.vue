<template>
  <div class="h-full flex flex-col">
    <div class="flex-1">
      <div
        class="container mx-auto px-4 py-4 md:py-8 min-h-full max-h-[calc(100vh-20rem)]"
      >
        <div class="relative">
          <!-- Timeline Line -->
          <div
            class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-blue-500/50 transform md:-translate-x-1/2"
          ></div>

          <!-- Timeline Items -->
          <div class="space-y-6 md:space-y-16 relative pb-8">
            <div
              v-for="(education, index) in educationList"
              :key="education.school"
              class="relative flex flex-col md:block"
              :class="[
                'pl-12 md:pl-0',
                index % 2 === 0
                  ? 'md:pr-[calc(50%+2rem)]'
                  : 'md:pl-[calc(50%+2rem)]',
              ]"
            >
              <!-- Timeline Dot -->
              <div
                class="absolute left-3 md:left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transform md:-translate-x-1/2 z-10 translate-y-6"
              >
                <div
                  class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-500/20 -inset-1 animate-ping"
                ></div>
              </div>

              <!-- Content Card -->
              <div
                class="w-full group p-4 md:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <!-- Year Badge -->
                <div
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 backdrop-blur-md z-20"
                >
                  <span
                    class="text-xs font-medium text-white whitespace-nowrap"
                  >
                    {{ education.year }}
                  </span>
                </div>

                <div class="mt-4 space-y-3">
                  <div>
                    <h3
                      class="text-base md:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                    >
                      {{ education.school }}
                    </h3>
                    <p class="text-xs md:text-sm text-gray-400 mt-0.5">
                      {{ education.degree }}
                    </p>
                  </div>

                  <p class="text-xs md:text-sm text-gray-300 leading-relaxed">
                    {{ education.description }}
                  </p>

                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="achievement in education.achievements"
                      :key="achievement"
                      class="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] md:text-xs text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      {{ achievement }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Education {
  school: string;
  degree: string;
  year: string;
  description: string;
  achievements: string[];
}

const educationList: Education[] = [
  {
    school: "Manisa Celal Bayar University",
    degree: "Bachelor's in Software Engineering",
    year: "2016 - 2020",
    description:
      "Focused on software development fundamentals, algorithms, and modern web technologies.",
    achievements: [
      "3.21 GPA",
      "Full Stack Development",
      "Mobile Development",
      "Software Architecture",
    ],
  },
  {
    school: "Erasmus+ Exchange Program",
    degree: "Computer Science Exchange Student",
    year: "2019",
    description:
      "Participated in an international exchange program focusing on advanced software development practices.",
    achievements: [
      "International Experience",
      "Cross-cultural Collaboration",
      "Advanced Programming",
    ],
  },
  {
    school: "Udacity",
    degree: "React Nanodegree Program",
    year: "2020",
    description:
      "Intensive program focused on modern React development, including Redux, React Native, and advanced state management patterns.",
    achievements: [
      "React Ecosystem",
      "State Management",
      "Mobile Development",
      "Modern JavaScript",
    ],
  },
  {
    school: "AWS Training and Certification",
    degree: "AWS Certified Developer - Associate",
    year: "2021",
    description:
      "Comprehensive cloud computing certification covering AWS services, serverless architecture, and cloud-native development.",
    achievements: [
      "Cloud Architecture",
      "Serverless Computing",
      "AWS Services",
      "DevOps Practices",
    ],
  },
  {
    school: "Google Cloud Training",
    degree: "Professional Cloud Developer",
    year: "2022",
    description:
      "Advanced certification in cloud-native development, focusing on scalable and reliable applications on Google Cloud Platform.",
    achievements: [
      "Cloud Native Development",
      "Microservices",
      "Container Orchestration",
      "CI/CD Pipelines",
    ],
  },
];
</script>
