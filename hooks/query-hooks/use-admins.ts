import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAdmin = (userId?: any) => {
  const queryClient = useQueryClient();

  // Get admins
  const {
    data: admins,
    isLoading: adminsLoading,
  } = useQuery([`admins`], () => {
    return api.admin.getAdmins();
  });

  // Post Admin
  const {
    mutate: createAdmin,
    isLoading: adminCreating,
    error: creatingAdminError,
  } = useMutation({
    mutationFn: (details: object) => api.admin.postAdmin(details),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      toast.success("Admin created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create admin: ${error.message}`);
    },
  });

  // Patch Company
  const {
    mutate: updateAdmin,
    isLoading: adminUpdating,
    error: updatingAdminError,
  } = useMutation({
    mutationFn: (details: object) =>
      api.admin.patchAdmin(userId, details),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admins"],
      });
      toast.success("Admin updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to update admin: ${error.message}`);
    },
  });

  return {
    admins,
    adminsLoading,
    createAdmin,
    adminCreating,
    creatingAdminError,
    updateAdmin,
    adminUpdating,
    updatingAdminError
  };
};
