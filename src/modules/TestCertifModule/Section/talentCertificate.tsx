import { Button } from '@/components';
import Certificate, { CertificateDetail } from '@/components/ui/certificate';
import { ArrowLeft, BookmarkIcon } from 'lucide-react';

export const TalentCertificate: React.FC = () => {

    const certificate: CertificateDetail[] = [
        {
          id: 1,
          title: 'Web Development Bootcamp by Udemy',
          file: new File(["dummy content"], "webdev-certificate.pdf", { type: "application/pdf" })
        },
        {
          id: 2,
          title: 'SQL for Data Science by Coursera',
          file: new File(["dummy content"], "sql-certificate.pdf", { type: "application/pdf" })
        },
        {
          id: 3,
          title: 'UI/UX Design by Coursera',
          file: new File(["dummy content"], "uiux-certificate.pdf", { type: "application/pdf" })
        },
      ];
      

  return !certificate ? (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <div
        data-testid="loading-spinner"
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
      ></div>
    </div>
  ) : (
    <div className="flex w-full justify-center">
      <div className="m-6 w-full max-w-6xl justify-center bg-white">
        <div className="flex w-full justify-between p-4">
          <Button variant="primary-outline" className="flex py-2">
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Button>
          <Button variant="primary" className="flex py-2">
            <BookmarkIcon className="h-6 w-6 text-white" />
            <span>Masukkan ke Favorit</span>
          </Button>
        </div>

        <div className="flex w-full flex-col items-center space-y-2 p-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
          <img src="image-3.png" alt="Logo" className="h-[330px] w-[298px]" />
          <div className="w-full flex-col items-center space-y-4">
            <Certificate certificates={certificate} />
          </div>
        </div>
      </div>
    </div>
  );
};