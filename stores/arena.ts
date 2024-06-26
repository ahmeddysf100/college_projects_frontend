import { defineStore } from "pinia";
import type { Arena, Arena_updated, Arena_updated_data, Arena_updated_gear, arenaForDto, JoinArena, joinArenaDto } from "~/createArena";
import type { CreateArena } from "~/createArena";

export const useArenaStore = defineStore("arena", () => {
  const ip = useRuntimeConfig().public.IP_HOME;
  const useUser = useUserStore();
  const useModel = useMyModalErrorStore();
  const toast = useToast();

  const arena_updated_data = ref<Arena_updated_data>()
  const arena_updated_gear = ref<Arena_updated_gear | string>()
  const arenaData = ref<CreateArena>();
  const arenaId = ref();

  const admin_arena_id = useCookie("adminArenaId", {
    maxAge: 7200,
  });
  const user_arena_token = useCookie("userArenaToken", {
    maxAge: 7200,
  });

  const setArenaData = (data?: CreateArena) => (arenaData.value = data);
  const setArena = (data?: string) => (arenaId.value = data);

  const set_user_arena_token = (data?: string) =>
    (user_arena_token.value = data);
  const set_admin_arena_id = (data?: string) => (admin_arena_id.value = data);

  const createArena = async (data: arenaForDto) => {
    try {
      set_user_arena_token();
      set_admin_arena_id();
      setArena();
      const req = await $fetch<CreateArena>(
        `http://${ip}:3333/arena`,
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
      set_user_arena_token(req.accessToken);
      set_admin_arena_id(req.arena.adminId);
      setArena(req.arena.id);
      // setArenaData(req);
    } catch (error: any) {
      toast.add({
        title: error.response._data.message,
      });
      
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  const joinArena = async (data: joinArenaDto) => {
    try {
      set_user_arena_token();
      setArena();
      const req = await $fetch<JoinArena>(
        `http://${ip}:3333/arena/join`,
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
      if (req.arena) {
        set_user_arena_token(req.accessToken);
        refreshCookie("userArenaToken");
        setArena(req.arena.id);
        set_admin_arena_id(req.userId);

        setArenaData(req);
      }
    } catch (error: any) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa22");
      toast.add({
        title: error.response._data.message,
      });
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  return {
    arenaData,
    admin_arena_id,
    user_arena_token,
    arenaId,
    arena_updated_data,
    arena_updated_gear,
    createArena,
    joinArena,
  };
});
