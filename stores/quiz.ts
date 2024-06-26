import { defineStore } from "pinia";

export const useMyQuizStore = defineStore("quiz", () => {
  const useModel = useMyModalErrorStore();
  const ip = useRuntimeConfig().public.IP_HOME;

  const questions = ref();
  const time = ref();
  const startTimer = ref(false);
  const showTimer = ref(false);
  const timerPosition = ref('nav')
  const startSubmit = ref(false)

  const setQuitions = (data?: any) => (questions.value = data);
  const setTime = (data?: any) => (time.value = data);
  const setStartTimer = (data?: any) => (startTimer.value = data);
  const setShowTimer = (data?: any) => (showTimer.value = data);

  const getRandomQuestions = async (data: any) => {
    // console.table(data);
    try {
      const res = await $fetch<any>(
        `http://${ip}:3333/quiz/${data.count}/${data.difficulty}/${data.subject}`
      );
      // console.log(res);
      // if (res.HttpStatus === 201) {
      //   useModel.setModalValues(
      //     true,
      //     "Account Created Successfully",
      //     `your new account ${res} is ready to use `
      //   );
      // }
      await setQuitions(res);
      //  console.log(questions.value)
    } catch (error: any) {
      console.log(error);
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  return {
    questions,
    time,
    startTimer,
    showTimer,
    startSubmit,
    timerPosition,
    setTime,
    setStartTimer,
    getRandomQuestions,
  };
});
