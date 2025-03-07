import { Container } from "@/components/ui/container";
import { SelectedIssueProvider } from "@/context/use-selected-issue-context";
import withProjectLayout from "@/app/project-layout/withProjectLayout";

const BacklogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container backlog={true} className="h-full">
      <main className="w-full">
        <SelectedIssueProvider>{children}</SelectedIssueProvider>
      </main>
    </Container>
  );
};

export default withProjectLayout(BacklogLayout);
