import { type Game, type GameWithStats, type Tag } from "@playpal/schemas";
import { type GamePayload, type GameResponse } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query<GameResponse, GamePayload>({
      query: ({ tags = undefined, search = undefined, page = 1, limit = 100 }) => {
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
      providesTags: ['Games']
    }),
    createGame: builder.mutation<Game, FormData>({
      query: (body: FormData) => ({
        url: "/games",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Games'],
    }),

    getGame: builder.query<GameWithStats, string>({
      query: (id) => `games/${id}`,
    }),
    getRecommendations: builder.query<GameResponse, number>({
      query: (limit = 10) => `games/recommendations?limit=${limit}`,
    }),
  }),
});

export const { useGetGamesQuery, useGetRecommendationsQuery, useCreateGameMutation, useGetGameQuery } = gameApi;