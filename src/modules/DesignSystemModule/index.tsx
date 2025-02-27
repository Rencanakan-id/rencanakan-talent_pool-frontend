import { Typography } from "@/components";

export const DesignSystemModule = () => {
  return (
<div className="p-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Design System | Typography</h1>
      
      <div className="space-y-4">
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </div>
      
      <div className="space-y-4">
        <Typography variant="s1">Subheading 1</Typography>
        <Typography variant="s2">Subheading 2</Typography>
        <Typography variant="s3">Subheading 3</Typography>
        <Typography variant="s4">Subheading 4</Typography>
        <Typography variant="s5">Subheading 5</Typography>
        <Typography variant="s6">Subheading 6</Typography>
      </div>
      
      <div className="space-y-4">
        <Typography variant="b1">Body 1</Typography>
        <Typography variant="b2">Body 2</Typography>
        <Typography variant="b3">Body 3</Typography>
        <Typography variant="b4">Body 4</Typography>
        <Typography variant="b5">Body 5</Typography>
        <Typography variant="small">Small Text</Typography>
      </div>
    </div>
  );
}