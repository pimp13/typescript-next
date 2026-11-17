"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import {
  getPublicArticle,
  listPublicArticles,
  recordPublicArticleView,
} from "@/features/articles/api";

export function usePublicArticles(search = "") {
  return useQuery({
    queryKey: queryKeys.publicArticles.list({ search }),
    queryFn: async () => {
      const response = await listPublicArticles({ search });
      return response.data ?? [];
    },
  });
}

export function usePublicArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.publicArticles.detail(slug),
    queryFn: async () => {
      const response = await getPublicArticle(slug);
      return response.data ?? null;
    },
    enabled: Boolean(slug),
  });
}

export function useRecordArticleView(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recordPublicArticleView(slug),
    onSuccess: async (response) => {
      const viewCount = response.data?.view_count;
      if (typeof viewCount === "number") {
        queryClient.setQueryData(
          queryKeys.publicArticles.detail(slug),
          (current: unknown) => {
            if (!current || typeof current !== "object") return current;
            return { ...current, view_count: viewCount };
          },
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queryKeys.publicArticles.all,
      });
    },
  });
}
