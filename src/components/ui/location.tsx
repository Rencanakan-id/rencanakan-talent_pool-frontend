import { Typography } from '../atoms/typography';
import { Badge } from './badge';

type LocationProps = Readonly<{
  data?: ReadonlyArray<string>;
}>;

function Location({ data = [] }: LocationProps) {
  return (
    <div className="min-h-[119px] w-full rounded-[4px] border border-gray-300 px-6 py-6">
      <Typography variant="p1" className="pb-4">
        Bersedia Ditempatkan di Kota
      </Typography>

      {data.length > 0 ? (
        <div className="min-h-[23]px w-full flex-wrap space-y-3 space-x-1">
          {data.map((loc) => (
            <Badge asChild key={loc} variant={'profileLocation'}>
              <Typography variant="p4" className="font-semibold text-black">
                {loc}
              </Typography>
            </Badge>
          ))}
        </div>
      ) : (
        <Typography variant="p3" className="text-gray-500">
          Belum memilih lokasi
        </Typography>
      )}
    </div>
  );
}

export default Location;
