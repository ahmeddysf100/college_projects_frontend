import { defineStore } from "pinia";
import type { Arena } from "~/createArena";
import type { CreateArena } from "~/types";

export const useMyCreateArenaStore = defineStore("arena", () => {
  const useUser = useUserStore();
  const useModel = useMyModalErrorStore();
 const arenaData = ref<Arena>()



 const setArenaData = (data?: Arena) => (arenaData.value = data);


  const createArena = async (data: CreateArena) => {
    try {
      const req = await $fetch<Arena>("http://192.168.31.170:3333/arena", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${useUser.token}`,
          
        },
      });
      console.log(req);
      useModel.setModalValues(
        true,
        "Response message",
        JSON.stringify(req, null, 2)
      );
        setArenaData(req)

    } catch (error: any) {
      console.log();
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  return{
    createArena
  }
});
