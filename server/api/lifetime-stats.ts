const { lifetime_stats } = useRuntimeConfig();

const { birthday, first_work_experience } = lifetime_stats;

const now = new Date();

const year = 1000 * 60 * 60 * 24 * 365;

const getAge = () => {
  const birthday_date = new Date(birthday);

  return Math.floor((now.getTime() - birthday_date.getTime()) / year);
};

const getExperience = () => {
  const first_work_experience_date = new Date(first_work_experience);

  return Math.floor(
    (now.getTime() - first_work_experience_date.getTime()) / year
  );
};

export default defineEventHandler(async (event) => {
  const age = getAge();
  const experience = getExperience();

  return { age, experience };
});
