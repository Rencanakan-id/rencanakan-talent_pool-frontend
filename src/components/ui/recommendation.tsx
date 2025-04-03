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
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationProps> = ({
  recommendations = [],
  onAccept,
  onDecline,
}) => {
  return (
    <div className="min-h-[200px] w-full rounded-[8px] border border-gray-300 px-6 py-6">
      <Typography variant="p1">Rekomendasi</Typography>
      
      {recommendations.length > 0 ? (
        <div className="w-full space-y-2 divide-y divide-gray-300">
          {recommendations.map((recommendation) => (
            <ExpandableRecommendation 
              key={recommendation.id} 
              recommendation={recommendation} 
              onAccept={onAccept}
              onDecline={onDecline}
            />
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

interface ExpandableRecommendationProps {
  recommendation: RecommendationResponseDTO;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const ExpandableRecommendation: React.FC<ExpandableRecommendationProps> = ({
  recommendation,
  onAccept,
  onDecline,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 112);
    }
  }, []);
  
  const handleAccept = () => {
    if (onAccept) {
      onAccept(recommendation.id);
    }
  };
  
  const handleDecline = () => {
    if (onDecline) {
      onDecline(recommendation.id);
    }
  };

  return (
    <div className={`space-y-1 py-4`}>
      <Typography variant="h5" className="pb-1">
        {recommendation.contractorName}
      </Typography>
      <div className="flex items-center space-x-4">
        {/* Pesan dengan proporsi 4 */}
        <div
          ref={contentRef}
          className={`relative flex-4 transition-all ${expanded ? 'h-full' : 'max-h-[112px] overflow-hidden'}`}
        >
          <Typography variant="p3">{recommendation.message}</Typography>
        </div>
        {
          recommendation.status === StatusType.PENDING && (
            <div className="flex-1 flex flex-col space-y-2">
              <Button variant="primary" onClick={handleAccept}>Terima</Button>
              <Button variant="primary-outline" onClick={handleDecline}>Tolak</Button>
            </div>
          )
        }
      </div>
      
      {isOverflowing && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-700 italic underline hover:cursor-pointer"
        >
          {expanded ? 'Lihat Lebih Sedikit' : 'Lihat Lebih Banyak'}
        </button>
      )}
    </div>
  );
};

export default RecommendationCard;