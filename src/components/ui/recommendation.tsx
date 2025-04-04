import React, { useState } from 'react';
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

  // Define the character limit for collapsed view
  const CHARACTER_LIMIT = 250;

  // Check if message exceeds character limit
  const isLongMessage = recommendation.message.length > CHARACTER_LIMIT;

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
    <div className="flex flex-col py-4 md:flex-row md:items-center md:space-x-4">
      <div>
        <Typography variant="h5" className="pb-1">
          {recommendation.contractorName}
        </Typography>
        <div className="md:flex-4">
          {/* Message section */}
          <div>
            <Typography variant="p3">
              {expanded ? (
                <>
                  {recommendation.message}{' '}
                  {isLongMessage && (
                    <button
                      onClick={() => setExpanded(false)}
                      className="text-sm text-gray-500 italic underline hover:cursor-pointer"
                    >
                      Lihat Lebih Sedikit
                    </button>
                  )}
                </>
              ) : (
                <>
                  {isLongMessage ? (
                    <>
                      {recommendation.message.substring(0, CHARACTER_LIMIT)}{' '}
                      <button
                        onClick={() => setExpanded(true)}
                        className=" text-sm text-gray-500 italic underline hover:cursor-pointer"
                      >
                        Lihat Lebih Banyak
                      </button>
                    </>
                  ) : (
                    recommendation.message
                  )}
                </>
              )}
            </Typography>
          </div>
        </div>
      </div>

      {recommendation.status === StatusType.PENDING && (
        <div className="flex flex-col space-y-2 md:flex-1">
          <Button variant="primary" onClick={handleAccept}>Terima</Button>
          <Button variant="primary-outline" onClick={handleDecline}>Tolak</Button>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;