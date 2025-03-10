import { Typography, Textarea, Button, FileInput, Input } from '@/components';
import Experience from '@/components/ui/experience';
import { Mail, Search, ArrowRight, ChevronRight, User, Bell, ExternalLink } from 'lucide-react';

import { Combobox } from '@/components/ui/combobox';
import { ComboboxCheckBox } from '@/components/ui/combobox-checkbox';
import { locations } from '@/data/static';
import Location from '@/components/ui/location';
import UserProfileCard from '@/components/ui/profile';

const dummyUser = {
  id: '1',
  firstName: 'Gabriella',
  price: 7500000,
  lastName: 'Naomi',
  email: 'gabriella@example.com',
  phoneNumber: '+62 8123456789',
  address: 'Jl. Sudirman No. 1, Jakarta',
  job: 'Software Engineer',
  photo: 'https://via.placeholder.com/150',
  aboutMe: 'Passionate about web development and cloud computing.',
  nik: '1234567890123456',
  npwp: '12.345.678.9-012.345',
  photoKtp: 'https://via.placeholder.com/150',
  photoNpwp: 'https://via.placeholder.com/150',
  photoIjazah: 'https://via.placeholder.com/150',
  experienceYears: 5,
  skkLevel: 'Senior',
  currentLocation: 'Jakarta, Indonesia',
  preferredLocations: ['Bali', 'Surabaya', 'Bandung'],
  skill: 'React, NestJS, Kubernetes',
};
export const DesignSystemModule = () => {
  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-2xl font-bold">Design System | Typography</h1>

      <div className="space-y-4">
        <Typography variant="d1">Display 1</Typography>
        <Typography variant="d2">Display 2</Typography>
      </div>

      <div className="w-full space-y-4">
        <Combobox data={locations} type="Lokasi" />
        {/* <ComboboxCheckBox /> */}
      </div>
      <div className="w-full space-y-4">
        {/* <Combobox /> */}
        <ComboboxCheckBox />
      </div>
      <div className="w-full space-y-4">
        {/* <Combobox /> */}
        <UserProfileCard user={dummyUser} />
      </div>
      <div className="w-full space-y-4">
        <h1> Location on Profile</h1>
        <Location
          data={[
            'Jakarta',
            'Surabaya',
            'Bandung',
            'Medan',
            'Semarang',
            'Makassar',
            'Palembang',
            'Yogyakarta',
            'Denpasar',
            'Balikpapan',
            'Jakarta',
            'Surabaya',
            'Bandung',
            'Medan',
            'Semarang',
            'Makassar',
            'Palembang',
            'Yogyakarta',
            'Denpasar',
            'Balikpapan',
          ]}
        />
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
      <div>
        <h1> Experience Detail </h1>
        <Experience />
      </div>

      <h1 className="text-2xl font-bold">Design System | Input File</h1>

      <div>
        <FileInput data-slot="input" textLabel="Empty Input File" state={'empty'} />
      </div>

      <div>
        <FileInput data-slot="input" textLabel="Filled Input File" state={'filled'} />
      </div>

      <div>
        <FileInput data-slot="input" textLabel="Error Input File" state={'error'} />
      </div>

      <h1 className="text-2xl font-bold">Design System | Input (Text Fields)</h1>

      <div className="space-y-6">
        <div>
          <Typography variant="p2" className="mb-2">
            Default Input
          </Typography>
          <div className="max-w-md space-y-4">
            <Input placeholder="Basic input field" />
            <Input label="With Label" placeholder="Enter your name" />
            <Input label="Password Input" type="password" placeholder="Enter your password" />
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Input with Prefix
          </Typography>
          <div className="max-w-md space-y-4">
            <Input
              label="With Icon Prefix"
              placeholder="Enter your email"
              prefixIcon={<Mail size={18} />}
            />
            <Input label="With Text Prefix" placeholder="Enter amount" prefixText="Rp." />
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Side-by-Side Inputs (Small Variant)
          </Typography>
          <div className="max-w-md space-y-4">
            <div className="flex flex-wrap gap-4">
              <Input variant="small" label="First Name" placeholder="John" />
              <Input variant="small" label="Last Name" placeholder="Doe" />
            </div>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Custom Widths
          </Typography>
          <div className="max-w-md space-y-4">
            <div className="flex flex-wrap gap-4">
              <Input label="30% widths" placeholder="30%" width="30%" />
              <Input label="80% widths" placeholder="80%" width="80%" />
            </div>
          </div>
        </div>

        <div>
          <Typography variant="p2" className="mb-2">
            Error State
          </Typography>
          <div className="max-w-md space-y-4">
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
