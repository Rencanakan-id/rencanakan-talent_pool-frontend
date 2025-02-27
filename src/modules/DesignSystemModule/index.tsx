import { Typography } from '@/components';
import { Button } from '@/components';
import { Search, ArrowRight, ChevronRight, User, Bell } from 'lucide-react'; // Import some icons for examples

export const DesignSystemModule = () => {
  return (
    <div className="flex flex-col gap-5 p-6">
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

      <h1 className="text-2xl font-bold">Design System | Buttons</h1>

      <div className="space-y-6">
        <div>
          <Typography variant="b2" className="mb-2">
            Regular Buttons (No Icons)
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="button-blue">Primary Blue</Button>
            <Button variant="button-blue-outline">Blue Outline</Button>
            <Button variant="button-grey">Grey Button</Button>
            <Button variant="button-orange">Orange Button</Button>
            <Button variant="button-orange-outline">Orange Outline</Button>
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Buttons with Icons
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="button-blue" icon={<Search size={16} />}>
              Search
            </Button>
            <Button variant="button-orange" icon={<Bell size={16} />}>
              Notifications
            </Button>
            <Button variant="button-orange-outline" icon={<Bell size={16} />} iconPosition="end">
              Alerts
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Buttons with Icons (Start Position)
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="button-blue" icon={<Search size={16} />}>
              Search
            </Button>
            <Button variant="button-blue-outline" icon={<User size={16} />}>
              Profile
            </Button>
            <Button variant="button-grey" icon={<ArrowRight size={16} />}>
              Next
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Buttons with Icons (End Position)
          </Typography>
          <div className="flex flex-wrap gap-4">
            <Button variant="button-blue" icon={<ChevronRight size={16} />} iconPosition="end">
              Continue
            </Button>
            <Button
              variant="button-blue-outline"
              icon={<ArrowRight size={16} />}
              iconPosition="end"
            >
              Next Step
            </Button>
            <Button variant="button-grey" icon={<Search size={16} />} iconPosition="end">
              Search Results
            </Button>
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Button Sizes
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="button-blue" size="sm" icon={<Search size={14} />}>
              Small
            </Button>
            <Button variant="button-blue" icon={<Search size={16} />}>
              Default
            </Button>
            <Button variant="button-blue" size="lg" icon={<Search size={18} />}>
              Large
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
