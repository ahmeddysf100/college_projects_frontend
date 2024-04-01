import { defineStore } from "pinia";
import type { Arena, arenaForDto, joinArenaDto } from "~/createArena";
import type { CreateArena } from "~/createArena";

export const useArenaStore = defineStore("arena", () => {
  const useUser = useUserStore();
  const useModel = useMyModalErrorStore();


  const arenaData = ref<CreateArena>();


  const admin_arena_token = useCookie("adminArenaToken", {
    maxAge: 7200,
  });
  const admin_arena_id = useCookie("adminArenaId", {
    maxAge: 7200,
  });


  const user_arena_token = useCookie("userArenaToken", {
    maxAge: 7200,
  });
  const user_arena_id = useCookie("userArenaId", {
    maxAge: 7200,
  });


  const setArenaData = (data?: CreateArena) => (arenaData.value = data);

  const set_admin_arena_token = (data?: string) =>
    (admin_arena_token.value = data);
  const set_admin_arena_id = (data?: string) => (admin_arena_id.value = data);


  const set_user_arena_token = (data?: string) =>
    (user_arena_token.value = data);
  const set_user_arena_id = (data?: string) => (user_arena_id.value = data);




  const createArena = async (data: arenaForDto) => {
    try {
      const req = await $fetch<CreateArena>(
        "http://192.168.31.170:3333/arena",
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${useUser.token}`,
          },
        }
      );
      console.log(req);
      // useModel.setModalValues(
      //   true,
      //   "Response message",
      //   JSON.stringify(req, null, 2)
      // );
      set_admin_arena_token(req.accessToken);
      set_admin_arena_id(req.arena.id);
      setArenaData(req);
    } catch (error: any) {
      console.log();
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  const joinArena = async (data: joinArenaDto) => {
    try {
      const req = await $fetch<CreateArena>(
        "http://192.168.31.170:3333/arena/join",
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${useUser.token}`,
          },
        }
      );
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
      // useModel.setModalValues(
      //   true,
      //   "Response message",
      //   JSON.stringify(req, null, 2)
      // );
      set_user_arena_token(req.accessToken);
      refreshCookie('userArenaToken')
      set_user_arena_id(req.arena.id);
      refreshCookie('userArenaId')
      setArenaData(req);
    } catch (error: any) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa22');
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  return {
    arenaData,
    admin_arena_token,
    admin_arena_id,
    user_arena_token,
    user_arena_id,
    createArena,
    joinArena,
  };
});
