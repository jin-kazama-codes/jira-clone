import { Container } from "@/components/ui/container";
import { SelectedIssueProvider } from "@/context/use-selected-issue-context";
import withProjectLayout from "@/app/project-layout/withProjectLayout";

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full" board={true}>
      <main className="w-full">
        <SelectedIssueProvider>{children}</SelectedIssueProvider>
      </main>
    </Container>
  );
};

export default withProjectLayout(BoardLayout);
