"use client";
import { Button } from "@/components/ui/button";
import AdminList from "@/components/superAdmin/admin/adminList";
import CompanyList from "@/components/superAdmin/company/companyList";
import Link from "next/link";
import { AddCompanyModal } from "@/components/modals/super-admin/company/add-company";
import { FaRegBuilding, FaUserShield } from "react-icons/fa";
import { useCompany } from "@/hooks/query-hooks/use-company";
import { AddAdminModal } from "@/components/modals/super-admin/admin/add-admin";

const SuperAdminPage = ({
  searchParams,
}: {
  searchParams?: { view?: string };
}) => {
  const view = searchParams?.view || "companies";

  const { companies, companiesLoading } = useCompany();

  if (companiesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto h-screen py-8">
        <div className="mb-6 flex items-center justify-between">
          <div
            className="inline-flex rounded-md text-white shadow-sm dark:bg-darkSprint-30"
            role="group"
          >
            <Link
              href="?view=companies"
              className={`
          inline-flex items-center rounded-s-lg border dark:border-darkSprint-30 px-4 py-2
          text-sm font-medium
          transition-colors duration-200
          ${
            view === "companies"
              ? "bg-background border-border hover:bg-muted hover:text-primary text-button dark:text-white"
              : "text-primary-foreground border-darkSprint-30 bg-button hover:bg-darkSprint-10/90 dark:bg-darkSprint-10"
          }
          focus:z-10 focus:ring-2 focus:ring-dark-0
        `}
            >
              <FaRegBuilding className="mr-2 h-4 w-4" />
              Companies
            </Link>
            <Link
              href="?view=admins"
              className={`
          inline-flex items-center rounded-r-lg border-b border-r border-t px-4
          py-2 text-sm font-medium
          transition-colors duration-200
          ${
            view === "admins"
              ? "bg-background border-border hover:bg-muted hover:text-primary text-button dark:text-white"
              : "text-primary-foreground border-darkSprint-30 bg-button hover:bg-darkSprint-10/90 dark:bg-darkSprint-10"
          }
          focus:ring-primary focus:z-10 focus:ring-2
        `}
            >
              <FaUserShield className="mr-2 h-4 w-4" />
              Admins
            </Link>
          </div>

          {view === "companies" ? (
            <AddCompanyModal>
              <Button className="rounded !bg-button px-4 py-2 text-white dark:!bg-dark-0">
                Add Company
              </Button>
            </AddCompanyModal>
          ) : (
            <AddAdminModal>
              <Button className="rounded !bg-button px-4 py-2 text-white dark:!bg-dark-0">
                Add Admin
              </Button>
            </AddAdminModal>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6">
          {view === "companies" ? (
            <CompanyList companies={companies} />
          ) : (
            <AdminList />
          )}
        </div>
      </div>
    </>
  );
};

export default SuperAdminPage;
