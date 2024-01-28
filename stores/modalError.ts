import { defineStore } from "pinia";

export const useMyModalErrorStore = defineStore("modalError", () => {
  const useDashboard = useDashboardStore();
  const errorMessage = ref();
  const errorMessageHeader = ref();
  const modalIsOpen = ref(false);
  const btnDelete = ref(false);
  const questionId = ref()


  const setErrorMessage = (data?: any) => (errorMessage.value = data);
  const setErrorMessageHeader = (data?: any) =>
    (errorMessageHeader.value = data);
  const setModalIsOpen = (data?: any) => (modalIsOpen.value = data);
  const setBtnDelete = (data: any) => (btnDelete.value = data);
  const setQuestionId = (data: any) => (questionId.value = data)

  const setModalValues = (
    isopen: boolean,
    header: string,
    message: string,
    btnDelete?: boolean
  ) => {
    setModalIsOpen(isopen);
    setErrorMessageHeader(header);
    setErrorMessage(message);
    setBtnDelete(btnDelete);
  };

  return {
    errorMessage,
    errorMessageHeader,
    modalIsOpen,
    btnDelete,
    questionId,
    setErrorMessage,
    setErrorMessageHeader,
    setModalIsOpen,
    setQuestionId,
    setModalValues,
  };
});
