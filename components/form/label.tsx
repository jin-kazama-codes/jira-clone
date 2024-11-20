const Label: React.FC<
  { text: string; required?: boolean } & React.HTMLProps<HTMLLabelElement>
> = ({ text, required = true, ...props }) => {
  return (
    <label
      {...props}
      className="my-1 flex gap-x-1 text-xs font-medium text-black"
    >
      {text}
      {required ? <span className="text-red-600">*</span> : null}
    </label>
  );
};

export { Label };
