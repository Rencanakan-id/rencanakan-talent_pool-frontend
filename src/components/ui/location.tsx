import React from 'react';
import { Typography } from '../atoms/typography';
import { Badge } from './badge';

type LocationProps = {
  data?: string[];
};

function Location({ data = [] }: LocationProps) {
  return (
    <div className="min-h-[119px] w-auto max-w-[825px] min-w-[200px] rounded-[4px] border border-gray-500 px-6 py-6">
      <Typography variant="p1" className="pb-4">
        Bersedia Ditempatkan di Kota
      </Typography>

      {data.length > 0 ? (
        <div className="min-h-[23]px w-auto max-w-[825px] min-w-[200px] flex-wrap space-y-3 space-x-1">
          {data.map((loc, index) => (
            <Badge asChild key={index} variant={'profileLocation'}>
              <Typography variant="small" className="font-bold text-black">
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
