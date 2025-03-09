import { Button, Typography } from '@/components';

export const LandingPageModule: React.FC = () => {
  return (
    <div
      data-testid="main-container"
      className="flex h-[calc(100vh-80px)] gap-10 overflow-hidden max-md:flex-col max-md:px-4 md:pl-14 lg:pl-28"
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="animate-bg bg-rencanakan-sea-blue-500 absolute top-[-10%] left-[-20%] h-[90%] w-[80%] rounded-[50%]"></div>
        <div className="animate-bg animate-delay-[2000ms] absolute top-[-12%] right-[-12%] h-[80%] w-[70%] rounded-[50%] bg-[#001522]"></div>
        <div className="animate-bg animate-delay-[300ms] absolute right-[-20%] bottom-[-15%] h-[65%] w-[80%] rounded-[50%] bg-[#00090f]"></div>
        <div className="animate-bg animate-delay-[1200ms] absolute bottom-[-10%] left-[-18%] h-1/2 w-[75%] rounded-[50%] bg-[#001522]"></div>
        <div className="absolute inset-0 backdrop-blur-[80px]"></div>
      </div>
      
      <div
        data-testid="text-container"
        className="z-10 flex h-full flex-col justify-center pt-14 max-md:px-3 max-md:text-center lg:w-1/2 lg:pt-20"
      >
        <Typography variant="d1" className="text-rencanakan-pure-white font-bold xl:!text-6xl">
          YUK GABUNG SEBAGAI
        </Typography>
        <Typography variant="d1" className="text-rencanakan-pure-white mt-4 font-bold xl:!text-6xl">
          <span className="animate-graident-text">TALENT</span> KAMI
        </Typography>

        <Typography variant="p1" className="text-rencanakan-base-gray/85 mt-4 lg:mt-6">
          Lebih dari 500 kesempatan kerja menanti kamu! Dapatkan peluang karier sesuai keahlian dan
          minatmu
        </Typography>

        <div className="relative mt-6 flex gap-3 font-semibold max-md:justify-center lg:mt-12">
          <Button variant="secondary" className="lg:!h-11">
            <Typography variant="p2" className="text-gray-950">
              Gabung sekarang
            </Typography>
          </Button>
          <Button variant="secondary-outline" className="lg:!h-11">
            <Typography variant="p2">Login</Typography>
          </Button>
        </div>
      </div>

      <div
        data-testid="image-container"
        className="relative z-10 flex items-center justify-start max-sm:pt-8 lg:w-1/2"
      >
        <img
          src="/landingPage/hero.png"
          alt="Hero"
          className="animate-float-vertical z-10 ml-12 scale-110 md:scale-115 lg:-mb-10 lg:scale-120"
        />

        <div
          data-testid="animated-border"
          className="border-rencanakan-premium-gold-400 animate-glow absolute ml-12 h-[320px] w-[800px] rotate-[2deg] rounded-xl border-6 will-change-transform sm:h-[500px] lg:-mb-6 lg:ml-20 lg:h-[500px] xl:h-[560px]"
        />
      </div>
    </div>
  );
};
