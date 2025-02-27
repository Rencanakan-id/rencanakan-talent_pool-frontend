import { Typography } from '@/components';

export const DesignSystemModule = () => {
  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-2xl font-bold">Design System | Typography</h1>

      <div className="space-y-4">
        <Typography variant="d1">Display 1</Typography>
        <Typography variant="d2">Display 2</Typography>
      </div>

      <div className="space-y-4">
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </div>

      <div className="space-y-4">
        <Typography variant="p1">Parapraph 1</Typography>
        <Typography variant="p2">Parapraph 2</Typography>
        <Typography variant="p3">Parapraph 3</Typography>
        <Typography variant="p4">Parapraph 4</Typography>
        <Typography variant="p5">Parapraph 5</Typography>
        <Typography variant="small">Small Text</Typography>
      </div>
    </div>
  );
};
