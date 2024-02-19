import { defineStore } from "pinia";

export const useMyQuizStore = defineStore("quiz", () => {
  const useModel = useMyModalErrorStore();
  const questions = ref();
  const time = ref(12)
  const startTimer= ref(false)
  const setQuitions = (data?: any) => (questions.value = data);
  const setTime = (data?: any) => (time.value = data);
  const setStartTimer = (data?: any) => (startTimer.value = data);



  const getRandomQuestions = async (data: any) => {
    // console.table(data);
    try {
      const res = await $fetch<any>(
        `http://192.168.31.170:3333/quiz/${data.count}/${data.difficulty}`
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
    setTime,
    setStartTimer,
    getRandomQuestions,
  };
});
