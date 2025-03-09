import { useRef } from "react";
import { Typography, Stepper, Input } from "@/components";
import { hargaJasa } from "@/data/hargaJasa";
import { RegisterFormData } from "@/lib/register";
import { skkLevels } from "@/data/skkLevels";
import { yearsOfExperience } from "@/data/yearsOfExperience";

interface StepThreeFormProps {
  formData: RegisterFormData;
  updateFormData: (data: Partial<RegisterFormData>) => void;
}

export const StepThreeForm: React.FC<StepThreeFormProps> = ({ formData, updateFormData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  type SKKLevel = keyof typeof hargaJasa;
  type ExperienceLevel = keyof (typeof hargaJasa)["operator"];
  const skkLevel: SKKLevel = formData.skkLevel as SKKLevel;
  const skkLevelLabel = skkLevels.find((level) => level.value === formData.skkLevel)?.label
  const yearsOfExp: ExperienceLevel = formData.yearsOfExperience as ExperienceLevel;
  const yearsLabel =  yearsOfExperience.find((year) => year.value === formData.yearsOfExperience)?.label.replace(" Tahun", "") || "Unknown";
  const minHargaSewa = hargaJasa[skkLevel]?.[yearsOfExp]?.min ?? 0;
  const maxHargaSewa = hargaJasa[skkLevel]?.[yearsOfExp]?.max ?? 0;

  const formatToRupiah = (number: string | number) => {
    if (!number) return '';
    return `Rp${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    updateFormData({ price: rawValue });

    const formattedValue = formatToRupiah(rawValue);

    if (inputRef.current) {
      const cursorPosition = e.target.selectionStart ?? 0;
      const previousLength = e.target.value.length;

      inputRef.current.value = formattedValue;

      const newCursorPosition = cursorPosition + (formattedValue.length - previousLength);
      setTimeout(() => {
        inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  return (
    <>
      <Typography variant="h5">
          Kira-kira begini perkiraan harga kamu, cocok gak?
      </Typography>

      <div className="mx-4 my-4 items-center justify-center">
          <Stepper currentStep={2} />
      </div>

      <div className="flex flex-col items-start gap-4 self-stretch pt-2">
        <Typography variant="h6">Perkiraan Harga</Typography>
        <Typography variant="h2">
            {formatToRupiah(minHargaSewa)} <span> - </span> {formatToRupiah(maxHargaSewa)}
        </Typography>
        <Typography variant="p3">
            Untuk level <span className="font-semibold">{skkLevelLabel}</span> dengan{" "}
            <span className="font-semibold">{yearsLabel} tahun</span> pengalaman kerja
        </Typography>
      </div>

      <Input
        ref={inputRef}
        className="font-semibold placeholder:font-medium my-4"
        label="Tentukan Harga Kamu"
        style={{ marginTop: '30px' }}
        placeholder="Rp. -"
        onChange={handleHargaChange}
        defaultValue={formatToRupiah(formData.price || '')}
      />
    </>
  );
};
