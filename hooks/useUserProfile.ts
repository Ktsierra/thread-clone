import { getUserByClerkId } from "@/convex/user";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useUserProfile() {
  const { user } = useUser();

  const clerkId = user?.id ?? "";

  const userProfile = useQuery(api.user.getUserByClerkId, { clerkId });

  return { userProfile };
}
