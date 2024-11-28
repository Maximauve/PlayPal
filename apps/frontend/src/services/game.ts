import { type Tag } from "@playpal/schemas";
import { type GamePayload, type GameResponse } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query<GameResponse, GamePayload>({
      query: ({ tags, search, page = 1, limit = 1 }) => {
        const parameters = new URLSearchParams();
        if (tags) {
          tags.forEach((tag: Tag) => parameters.append('tags', tag.name));
        }
        if (typeof page === 'number' && !Number.isNaN(page)) {
          parameters.append('page', (page).toString());
        }
        if (typeof limit === 'number' && !Number.isNaN(limit)) {
          parameters.append('limit', (limit).toString());
        }
        if (typeof search === 'string' && search.trim().length > 0) {
          parameters.append('search', search);
        }
        return `games?${parameters.toString()}`;
      },
    }),
  }),
});

export const { useGetGamesQuery } = gameApi;
