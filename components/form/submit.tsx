import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export const FormSubmit: React.FC<{
  isLoading: boolean;
  onCancel: () => void;
  submitText: string;
  ariaLabel: string;
}> = ({ isLoading, onCancel, submitText, ariaLabel }) => {
  return (
    <div className="mt-5 pb-6 flex w-full gap-x-2 justify-end">
      <Button
        customColors
        customPadding
        className="flex items-center gap-x-2 dark:bg-dark-0 bg-button px-3 py-1.5 font-medium text-white hover:brightness-110"
        type="submit"
        name={ariaLabel}
        disabled={isLoading}
        aria-label={ariaLabel}
      >
        <span>{submitText}</span>
        {isLoading ? <Spinner white size="sm" /> : null}
      </Button>
      <Button
        customColors
        customPadding
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 font-medium dark:bg-dark-50 text-button underline-offset-2 hover:underline hover:brightness-110"
        name="cancel"
        aria-label={"cancel"}
      >
        Cancel
      </Button>
    </div>
  );
};
