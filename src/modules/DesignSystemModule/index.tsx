import { Typography, Textarea, Button } from "@/components";
import { Search, ArrowRight, ChevronRight, User, Bell, ExternalLink } from 'lucide-react';

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

      <Textarea textLabel="Nama Depan" placeholder="Masukkan nama depan"></Textarea>

      <h1 className="text-2xl font-bold">Design System | Buttons</h1>

      <div className="space-y-6">
        <div>
          <Typography variant="p2" className="mb-2">
            Regular Buttons
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="primary-outline">Primary Outline</Button>
            <Button variant="secondary-outline">Secondary Outline</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Buttons with Icons (Start Position)
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" icon={<Search size={16} />}>
              Search
            </Button>
            <Button variant="secondary" icon={<Bell size={16} />}>
              Notifications
            </Button>
            <Button variant="primary-outline" icon={<User size={16} />}>
              Profile
            </Button>
            <Button variant="secondary-outline" icon={<User size={16} />}>
              Profile
            </Button>
            <Button variant="link" icon={<ExternalLink size={16} />}>
              External Link
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Buttons with Icons (End Position)
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" icon={<ChevronRight size={16} />} iconPosition="end">
              Continue
            </Button>
            <Button variant="secondary" icon={<ChevronRight size={16} />} iconPosition="end">
              Continue
            </Button>
            <Button variant="primary-outline" icon={<ArrowRight size={16} />} iconPosition="end">
              Next Step
            </Button>
            <Button variant="secondary-outline" icon={<ArrowRight size={16} />} iconPosition="end">
              Next Step
            </Button>
            <Button variant="link" icon={<ExternalLink size={16} />} iconPosition="end">
              Learn More
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Button Sizes
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary">Default</Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Disabled Buttons
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" disabled>
              Primary Disabled
            </Button>
            <Button variant="secondary" disabled>
              Secondary Disabled
            </Button>
            <Button variant="primary-outline" disabled>
              Outline Disabled
            </Button>
            <Button variant="link" disabled>
              Link Disabled
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
