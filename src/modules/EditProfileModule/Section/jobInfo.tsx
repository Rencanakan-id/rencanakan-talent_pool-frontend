import React, { useRef } from 'react';
import { Button, Combobox, ComboboxCheckBox, Input, Textarea, Typography } from '@/components';
import { yearsOfExperience } from '@/data/yearsOfExperience';
import { skkLevels } from '@/data/skkLevels';
import { locations } from '@/data/location';
import { skills } from '@/data/skills';
import { UserProfile } from '@/components/ui/profile';

interface Props {
  data: UserProfile;
  initialData: UserProfile;
  onChange: (updated: Partial<UserProfile>) => void;
}

export const JobInfoSection: React.FC<Props> = ({ data, initialData, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    onChange({
      aboutMe: initialData.aboutMe,
      experienceYears: initialData.experienceYears,
      skkLevel: initialData.skkLevel,
      currentLocation: initialData.currentLocation,
      preferredLocations: initialData.preferredLocations,
      skill: initialData.skill,
      price: initialData.price,
    });

    if (inputRef.current) {
      inputRef.current.value = formatToRupiah(initialData.price ?? 0);
    }
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    onChange({ price: Number(rawValue) });

    if (inputRef.current) {
      inputRef.current.value = formatToRupiah(rawValue);
    }
  };

  const formatToRupiah = (number: string | number) => {
    if (!number) return '';
    const numStr = Number(number).toString();
    let formatted = '';
    let counter = 0;

    for (let i = numStr.length - 1; i >= 0; i--) {
      formatted = numStr[i] + formatted;
      counter++;
      if (counter % 3 === 0 && i !== 0) {
        formatted = '.' + formatted;
      }
    }
    return `Rp${formatted}`;
  };

  const parseExperienceYears = (yearsExp: number): string | undefined => {
    switch (yearsExp) {
      case 1:
        return '1 Tahun';
      case 2:
        return '2-3 Tahun';
      case 3:
        return '5 Tahun';
      case 4:
        return '> 5 Tahun';
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-[4px] px-6 py-6 mt-4">
      <div className="flex flex-col gap-2">
        <Typography variant="p1">Tentang Pekerjaan</Typography>
        <div className="mt-2">
          <Textarea
            textLabel="Tentang Saya"
            value={data.aboutMe}
            data-testid='about-me'
            onChange={(e) => onChange({ aboutMe: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Combobox
            data={yearsOfExperience}
            label="Lama Pengalaman *"
            value={parseExperienceYears(data.experienceYears)}
            onChange={(value) => onChange({ experienceYears: parseInt(value) })}
          />
          <Combobox
            data={skkLevels}
            label="Level Sertifikasi SKK *"
            value={data.skkLevel}
            onChange={(value) => onChange({ skkLevel: value })}
          />
          <Combobox
            data={locations}
            label="Lokasi Saat Ini *"
            value={data.currentLocation}
            onChange={(value) => onChange({ currentLocation: value })}
          />
          <div>
            <ComboboxCheckBox
              data={locations}
              label="Bersedia Ditempatkan Di Mana *"
              placeholder="Search..."
              value={data.preferredLocations
                .map((value) => locations.find((item) => item.value === value)?.label ?? value)
                .join(', ')}
              onChange={(valueArray) => onChange({ preferredLocations: valueArray })}
              maxSelection={5}
            />
            <Typography variant="p5" className="my-2">
              Pilih maksimal 5 lokasi
            </Typography>
          </div>
          <Combobox
            data={skills}
            label="Keahlian *"
            value={data.skill}
            onChange={(value) => onChange({ skill: value })}
          />
          <Input
            label="Harga"
            placeholder="Rp. -"
            onChange={handleHargaChange}
            className="h-9 px-[14px] py-[9px] sm:h-10 sm:px-5 sm:py-[11px]"
            defaultValue={formatToRupiah(data.price)}
            data-testid = "price-input"
            ref={inputRef}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="primary-outline" onClick={handleReset}>
            Reset Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};
