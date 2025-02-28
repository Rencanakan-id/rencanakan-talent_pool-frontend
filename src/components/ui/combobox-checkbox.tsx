'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from './checkbox';
import { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';

const locations = [
  { value: 'semua-lokasi', label: 'Semua Lokasi' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'medan', label: 'Medan' },
  { value: 'makassar1', label: 'Makassar' },
  { value: 'makassar2', label: 'Makassar' },
  { value: 'makassar3', label: 'Makassar' },
  { value: 'makassar4', label: 'Makassar' },
  { value: 'makassar5', label: 'Makassar' },
  { value: 'makassar6', label: 'Makassar' },
  { value: 'makassar7', label: 'Makassar' },
  { value: 'makassar8', label: 'Makassar' },
  { value: 'makassar9', label: 'Makassar' },
];

export function ComboboxCheckBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleLocation = (location: string) => {
    setSelected((prev) =>
      prev.includes(location) ? prev.filter((item) => item !== location) : [...prev, location]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[50px] w-[368px] justify-between p-0"
        >
          {value
            ? locations.find((location) => location.value === value)?.label
            : 'Bersedia Ditempatkan Dimana'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[368px] p-0">
        <Command>
          <div className="flex h-full items-center">
            <Typography variant="p5" className="flex items-center p-2">
              Terpilih:
            </Typography>
          </div>
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-2 items-center ">
              {selected.map((location) => (
                <Badge key={location} variant="location" className="flex items-center justify-center space-x-1 min-w-[93px] w-auto h-[25px]">
                  <Typography variant="p3" className='text-blue-900 m-1'>{location}</Typography>
                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLocation(location);
                    }}
                  >
                    <X className=" h-4 w-4 text-blue-900 cursor-pointer" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}

          <CommandInput placeholder="Lokasi" />
          <CommandList>
            <CommandEmpty>Lokasi tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                >
                  <div className="m-2 flex w-full items-center gap-4">
                    <Checkbox id={location.label} checked={selected.includes(location.label)}  onCheckedChange={(checked) => toggleLocation(location.label)} />
                    <label  htmlFor={location.label} className="cursor-pointer">{location.label}</label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
