interface Education {
  school: string;
  degree: string;
  year: string;
  description: string;
  achievements: string[];
}

export const educationList: Education[] = [
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
