import { Typography, Stepper, Input, FileInput, Textarea } from '@/components';

export const StepTwoForm = () => {
  return (
    <>
      <Typography variant="h5" className="text-center">
        Ceritakan sedikit pengalaman kerja kamu
      </Typography>

      <div className="mx-4 my-4 items-center justify-center">
        <Stepper currentStep={1} />
      </div>

      <Typography variant="h6">Tentang Pekerjaan</Typography>

      <div className="mb-4 space-y-6">
        <Textarea
          textLabel="Tentang Saya"
          placeholder="Ceritakan tentang dirimu secara singkat di sini..."
        />

        {/* PLaceholder input, karena dropdown belum ada */}
        <Input label="Lama Pengalaman" placeholder="Pilih tahun pengalaman" />

        <Input label="Level Sertifikasi SKK" placeholder="Pilih level" />

        <Input label="Lokasi Saat Ini" placeholder="Pilih kota" />

        <div>
          <Input label="Bersedia Ditempatkan Di Mana" placeholder="Pilih kota" />
          <Typography variant="p4" className="my-2">
            Pilih maksimal 5 lokasi
          </Typography>
        </div>

        <Input label="Keahlian" placeholder="Pilih keahlian" />
      </div>

      <div className="mb-4">
        <Typography variant="h6">Dokumen Pendukung</Typography>

        <div className="mt-2 space-y-2">
          <FileInput data-slot="input" textLabel="SKK" state={'empty'} />
        </div>
      </div>
    </>
  );
};
