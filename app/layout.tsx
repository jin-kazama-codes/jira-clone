import { type Metadata } from "next";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import Toaster from "@/components/toast";
import QueryProvider from "@/utils/provider";
import { AuthModalProvider } from "@/context/use-auth-modal";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Jira",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "TanStack",
  ],
  authors: [
    {
      name: "Jin Kazama",
      url: "#",
    },
  ],
  creator: "Jin Kazama",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head />
      <body className="bg-custom-background">
        <QueryProvider>
          <AuthModalProvider>
            <Toaster
              position="bottom-left"
              reverseOrder={false}
              containerStyle={{
                height: "92vh",
                marginLeft: "3vw",
              }}
            />
            {children}
          </AuthModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
