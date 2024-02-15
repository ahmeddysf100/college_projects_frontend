import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", () => {
  const useStore = useUserStore();
  const useModel = useMyModalErrorStore();

  const dataTable = ref();
  const apiErrors = ref();
  const insertRes = ref();
  const image = ref<Blob>();
  const questionById = ref();
  const D_question = ref();
  
  const setDataTable = (data?: any) => (dataTable.value = data);
  const setApiErrors = (data?: string | null) => (apiErrors.value = data);
  const setInsertRes = (data?: any) => (insertRes.value = data);
  const setImage = (data?: Blob) => (image.value = data);
  const setD_question = (data?: any) => (D_question.value = data);
  const setQuestionById = (data?: any) => (questionById.value = data);
  
  async function getAllQuestions() {
    try {
      const res = await $fetch<any>("http://192.168.31.170:3333/storage/questions");
      setDataTable(res);
    } catch (error) {
      setDataTable();
      console.log(error);
    }
  }
  
 

  const insertQuestion = async (data: any) => {
    try {
      // console.log(token)
      const res = await $fetch<any>("http://192.168.31.170:3333/storage/question", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${useStore.token}`,
        },
      });
      setInsertRes(res);
    } catch (error: any) {
      setInsertRes();
      setApiErrors(
        (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      );

      useModel.setModalValues(
        true,
        error.response.statusText +" "+ error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
      console.log(error.response);
    }
  };


  

  const getImageByName = async (data: any) => {
    // console.table({data: data , token: token})
    try {
      const res = await $fetch<any>(
        `http://192.168.31.170:3333/storage/getImage/${data}`
      ,{
        headers: {
          Authorization: `Bearer ${useStore.token}`,
        },
      });
      setImage(res);
      console.log(res);
    } catch (error) {
      setImage();
      setApiErrors(
        (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      );
      console.log(error);
    }
  };

  const getOneQuestion = async (data: any) => {
    setQuestionById();
    try {
      const res = await $fetch<any>(
        `http://192.168.31.170:3333/storage/getOneQuesion/${data}`,{
          headers: {
            Authorization: `Bearer ${useStore.token}`,
          }
        }
      );
      setQuestionById(res);
      console.log(res);
    } catch (error) {
      setQuestionById();
      setApiErrors(
        (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      );
      console.log(error);
    }
  };

  const deleteOneQuestion = async (data: any) => {
    await setD_question();
    try {
      const res = await $fetch<any>(`http://192.168.31.170:3333/storage/${data}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${useStore.token}`,
        },
      });
      await setD_question(res);
      console.log(res);
    } catch (error: any) {
      setDataTable();
      setApiErrors(
        (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      );
      console.log(error);
      useModel.setModalValues(
        true,
        error.response.statusText +" "+ error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  return {
    image,
    insertRes,
    apiErrors,
    dataTable,
    D_question,
    questionById,
    setImage,
    setDataTable,
    getAllQuestions,
    insertQuestion,
    getImageByName,
    getOneQuestion,
    deleteOneQuestion,
  };
});
