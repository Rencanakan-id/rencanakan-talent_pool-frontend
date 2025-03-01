import { Typography, Stepper, Input, FileInput } from "@/components";

export const StepOneForm = () => {
  return (
    <>
      <Typography variant="h5" className="text-center">
        Lengkapi formulir dan mulai perjalanan karier kamu!
      </Typography>
      
      <div className="my-4 mx-4 justify-center items-center">
        <Stepper currentStep={0} />
      </div>

      <Typography variant="h6" className="my-2">Masukkan Data Diri</Typography>
      <Typography variant="p4" className="font-semibold">Foto Diri</Typography>

      <div className="space-y-4 my-4">
        <div className="flex space-x-2">
          <Input
            label="Nama Depan"
            placeholder="Nama Depan"
          />
          <Input
            label="Nama Belakang"
            placeholder="Nama Belakang"
          />
        </div>

        <Input
          label="Email"
          placeholder="Masukkan email Anda"
        />

        <Input
          label="Nomor Telepon"
          placeholder="Masukkan nomor WhatsApp Anda"
        />

        <Input
          label="No. NIK"
          placeholder="Masukkan NIK Anda"
        />

        <Input
          label="No. NPWP"
          placeholder="Masukkan NPWP Anda"
        />
      </div>

      <div className="mb-4">
        <Typography variant="h6">Upload Dokumen</Typography>

        <div className="space-y-2 mt-2">
          <FileInput data-slot="input" textLabel="Foto KTP" state={'empty'} />
          <FileInput data-slot="input" textLabel="Foto NPWP" state={'empty'} />
          <FileInput data-slot="input" textLabel="Scan Ijazah" state={'empty'} />
        </div>
      </div>
    </>
  );
};