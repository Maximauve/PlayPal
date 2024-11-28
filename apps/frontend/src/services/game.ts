import { type Tag } from "@playpal/schemas";
import { type GamePayload, type GameResponse } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query<GameResponse, GamePayload>({
      query: ({ tags,  page = 1, limit = 1 }) => {
        const parameters = new URLSearchParams();
        if (tags) {
          tags.forEach((tag: Tag) => parameters.append('tags', tag.name));
        }
        parameters.append('page', (page).toString());
        parameters.append('limit', (limit).toString());
        return `games?${parameters.toString()}`;
      },
    }),
  }),
});

export const { useGetGamesQuery } = gameApi;
