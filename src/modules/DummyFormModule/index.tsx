import { Typography, Stepper } from "@/components";

export const RegisterModule = () => {
  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-rencanakan-pure-white">
      <div className="flex flex-col justify-center max-w-2xl mx-auto p-6">
        <Typography variant="h5" className="text-center">
          Lengkapi formulir dan mulai perjalanan karier kamu!
        </Typography>
        <Stepper currentStep={1}/>

        <div>
            <Typography variant="h6" className="my-2">Masukkan Data Diri</Typography>
            <Typography variant="s4" className="font-semibold">Foto Diri</Typography>
        </div>

        <div>
            <Typography variant="h6">Upload Dokumen</Typography>
            <p>
                Foto KTP
            </p>
            <p>
                Foto NPWP
            </p>
            <p>
                Scan Ijazah
            </p>
        </div>


      </div>
    </div>
  );
};
