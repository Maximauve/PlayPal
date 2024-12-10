import { type Rating, type RatingDto } from "@playpal/schemas";

import { baseApi } from "@/services/base";

export const ratingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query<Rating[], { gameId: string }>({
      query: ({ gameId }) => `/games/${gameId}/rating`,
    }),
    addRating: builder.mutation<Rating, { body: RatingDto, gameId: string }>({
      query: ({ gameId, body }) => ({
        url: `/games/${gameId}/rating`,
        method: "POST",
        body: body,
      }),
    }),
  }),

});

export const { useGetRatingsQuery, useAddRatingMutation } = ratingApi;
