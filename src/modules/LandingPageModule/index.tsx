import { Button, Typography } from "@/components";

export const LandingPageModule: React.FC = () => {
  return (
    <div data-testid="main-container" className="flex pl-28 h-[calc(100vh-80px)] gap-10 overflow-hidden">
      <div className="flex overflow-hidden absolute slay items-center justify-center">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div data-testid="text-container" className="flex z-10 pt-20 flex-col justify-center w-1/2">
        <Typography variant="d1" className="!text-6xl text-rencanakan-pure-white font-bold">YUK GABUNG SEBAGAI</Typography>
        <Typography variant="d1" className="!text-6xl text-rencanakan-pure-white font-bold mt-4"><span className="animate-graident-text">TALENT</span> KAMI</Typography>
      
        <Typography variant="p1" className="text-rencanakan-base-gray/85 mt-6">Lebih dari 500 kesempatan kerja menanti kamu! Dapatkan peluang karier sesuai keahlian dan minatmu</Typography>
        
        <div className="flex mt-12 gap-3 relative">
          <Button variant="secondary" className="!h-11"><Typography variant="p2" className="text-gray-950">Gabung sekarang</Typography></Button>
          <Button variant="secondary-outline" className="!h-11"><Typography variant="p2">Login</Typography></Button>
        </div>
      </div>

      <div data-testid="image-container" className="z-10 w-1/2 flex items-center relative">
        <img src="/landingPage/hero.png" alt="Hero" className="animate-float-vertical scale-120 -mb-10 ml-20 z-10" />

        <div 
          data-testid="animated-border"
          className="border-6 rotate-[2deg] border-rencanakan-premium-gold-400 absolute rounded-xl ml-20 w-[800px] h-[560px] -mb-6 will-change-transform animate-glow" 
        />
      </div>
    </div>
  );
};