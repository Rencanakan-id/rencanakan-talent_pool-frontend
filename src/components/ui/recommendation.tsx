import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '../atoms/typography';
import { Button } from './button';

export enum StatusType {
  PENDING = 'PENDING',
  APPROVED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface RecommendationResponseDTO {
  id: string;
  talentId: string;
  contractorId: number;
  contractorName: string;
  message: string;
  status: StatusType;
}

export interface RecommendationProps {
  recommendations: RecommendationResponseDTO[];
}

const RecommendationCard: React.FC<RecommendationProps> = ({ recommendations = [] }) => {
  return (
    <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 px-6 py-6">
      <Typography variant="p1">Rekomendasi</Typography>

      {recommendations.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300">
          {recommendations.map((recommendation) => (
            <ExpandableRecommendation key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      ) : (
        <Typography variant="p3" className="text-gray-500">
          Tidak ada Rekomendasi.
        </Typography>
      )}
    </div>
  );
};

const ExpandableRecommendation: React.FC<{ recommendation: RecommendationResponseDTO }> = ({
  recommendation,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 112);
    }
  }, []);

  return (
    <div className={`space-y-1 py-4`}>
      <Typography variant="h5" className="pb-1">
        {recommendation.contractorName}
      </Typography>
      <div className=" flex items-center space-x-4 md:flex-row">
        {/* Pesan dengan proporsi 4 */}
        <div
          ref={contentRef}
          className={`relative   ${expanded ? 'h-auto': 'h-[112px]'} md:flex-4`}
        >
          <div className={` transition-all ${expanded ? 'line-clamp-none' : 'line-clamp-4'}`}>
            <Typography variant="p3">{recommendation.message}</Typography>
          </div>
          <div className='mt-2'>
            {isOverflowing && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-700 italic underline hover:cursor-pointer"
              >
                {expanded ? 'Lihat Lebih Sedikit' : 'Lihat Lebih Banyak'}
              </button>
            )}
          </div>
       
         
        </div>
        {
          recommendation.status === StatusType.PENDING && (
          <div className="flex flex-col space-y-2 md:flex-1">
            <Button variant="primary">Terima</Button>
            <Button variant="primary-outline">Tolak</Button>
          </div>
          )
        }
       
      </div>

     
    </div>
  );
};

export default RecommendationCard;
