import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCompany = (companyId?: any) => {
  const queryClient = useQueryClient();

  // Get Companies
  const {
    data: companies,
    isLoading: companiesLoading,
    refetch: refetchCompanies,
  } = useQuery([`companies`], () => {
    return api.company.getCompany();
  });

  //Get company by id 
  const {
    data: company,
    isLoading: companyLoading,
    refetch: refetchCompany,
  } = useQuery({
    queryKey: [`company`, companyId],
  queryFn: () => api.company.getCompanyById(companyId),
  enabled: !!companyId,
  });

  // Post Company
  const {
    mutate: createCompany,
    isLoading: companyCreating,
    error: creatingError,
  } = useMutation({
    mutationFn: (company: object) => api.company.postCompany(company),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
      toast.success("Company created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create company: ${error.message}`);
    },
  });

  // Patch Company
  const {
    mutate: updateCompany,
    isLoading: companyUpdating,
    error: updatingError,
  } = useMutation({
    mutationFn: (company: object) =>
      api.company.patchCompany(companyId, company),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["company", companyId],
      });
      toast.success("Company updated successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to create company: ${error.message}`);
    },
  });

  return {
    company,
    companyLoading,
    refetchCompany,
    companies,
    companiesLoading,
    refetchCompanies,
    createCompany,
    companyCreating,
    creatingError,
    updateCompany,
    companyUpdating,
    updatingError,
  };
};
