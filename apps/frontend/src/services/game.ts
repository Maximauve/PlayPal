import { type Tag } from "@playpal/schemas";
// import { type GamePayload, type GameResponse } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query({
      query: ({ tags }) => {
        const parameters = new URLSearchParams();
        if (tags) {
          tags.forEach((tag: Tag) => parameters.append('tags', tag.name));
        }
        parameters.append('page', (1).toString());
        parameters.append('limit', (10).toString());
        return `games?${parameters.toString()}`;
      },
    }),
  }),
});

export const { useGetGamesQuery } = gameApi;
