import { type UseFormRegister } from "react-hook-form";
import { type FormValues } from "..";
import { Label } from "@/components/form/label";

const DescriptionField: React.FC<{
  register: UseFormRegister<FormValues>;
}> = ({ register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="description" text="Sprint Goal" required={false} />
      <input
        {...register("description")}
        type="text"
        id="description"
        className="form-input block h-32 w-[500px] rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-200 focus:outline-blue-400"
      />
    </div>
  );
};

export { DescriptionField };