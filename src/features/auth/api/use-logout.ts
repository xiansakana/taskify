import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
//! Uncomment if needed in the future
import {
  // InferRequestType,
  InferResponseType,
} from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth.logout)["$post"]
>;

//! Uncomment if needed in the future
// type RequestType = InferRequestType<
//   (typeof client.api.auth.logout)["$post"]
// >;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      return await response.json();
    },
    onSuccess: () => {
      //* *Added to help being redirected to sign-in */
      // router.push("/sign-in");
      router.refresh();
      toast.success("Logged out successfully");
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });

  return mutation;
};
