import { useParams } from "next/navigation";

// This is a hook to get the invite code from the URL

export const useInviteCode = () => {
  const params = useParams();
  return params.inviteCode as string;
};
