import { Typography, Input } from '@/components';
import { Mail } from 'lucide-react';

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

      <h1 className="text-2xl font-bold">Design System | Input (Text Fields)</h1>
      
      <div className="space-y-6">
        <div>
          <Typography variant="b2" className="mb-2">
            Default Input
          </Typography>
          <div className="space-y-4 max-w-md">
            <Input placeholder="Basic input field" />
            <Input label="With Label" placeholder="Enter your name" />
            <Input 
              label="Password Input" 
              type="password" 
              placeholder="Enter your password" 
            />
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Input with Prefix
          </Typography>
          <div className="space-y-4 max-w-md">
            <Input 
              label="With Icon Prefix" 
              placeholder="Enter your email" 
              prefixIcon={<Mail size={18} />} 
            />
            <Input 
              label="With Text Prefix" 
              placeholder="Enter amount" 
              prefixText="Rp." 
            />
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Side-by-Side Inputs (Small Variant)
          </Typography>
          <div className="space-y-4 max-w-md">
            <div className="flex flex-wrap gap-4">
              <Input 
                variant="small" 
                label="First Name" 
                placeholder="John"
              />
              <Input 
                variant="small" 
                label="Last Name" 
                placeholder="Doe"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Typography variant="b2" className="mb-2">
            Custom Widths
          </Typography>
          <div className="space-y-4 max-w-md">
            <div className="flex flex-wrap gap-4">
              <Input 
                label="30% widths" 
                placeholder="30%"
                width="30%"
              />
              <Input 
                label="80% widths" 
                placeholder="80%"
                width="80%"
              />
            </div>
          </div>
        </div>

        <div>
          <Typography variant="b2" className="mb-2">
            Error State
          </Typography>
          <div className="space-y-4 max-w-md">
            <Input 
              label="With Error Message" 
              placeholder="Invalid input" 
              error="This field is required" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
