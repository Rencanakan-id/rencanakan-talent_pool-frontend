import React, { useState } from 'react';
import { Typography } from '../atoms/typography';
import { Button } from './button';
import { ConfirmationBox } from '@/components/ui/confirmation-box';

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
  recommendations?: RecommendationResponseDTO[];
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
  const [isAcceptConfirmationOpen, setIsAcceptConfirmationOpen] = useState(false);
  const [isDeclineConfirmationOpen, setIsDeclineConfirmationOpen] = useState(false);

  const CHARACTER_LIMIT = 250;

  const isLongMessage = recommendation.message.length > CHARACTER_LIMIT;

  const handleAcceptConfirm = () => {
    if (onAccept) {
      onAccept(recommendation.id);
    }
    setIsAcceptConfirmationOpen(false);
  };

  const handleDeclineConfirm = () => {
    if (onDecline) {
      onDecline(recommendation.id);
    }
    setIsDeclineConfirmationOpen(false);
  };

  return (
    <div className="flex w-full flex-col space-y-4 py-4 md:flex-row md:items-center md:space-x-4">
      <div className="w-full md:w-3/4">
        <Typography variant="h5" className="pb-1">
          {recommendation.contractorName}
        </Typography>

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
                    className="text-sm text-gray-500 italic underline hover:cursor-pointer"
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

      {recommendation.status === StatusType.PENDING && (
        <div className="flex w-full flex-col space-y-2 md:w-1/4">
          <Button variant="primary" onClick={() => setIsAcceptConfirmationOpen(true)}>
            Terima
          </Button>
          <Button variant="primary-outline" onClick={() => setIsDeclineConfirmationOpen(true)}>
            Tolak
          </Button>
          
          <ConfirmationBox
            isOpen={isAcceptConfirmationOpen}
            onClose={() => setIsAcceptConfirmationOpen(false)}
            onConfirm={handleAcceptConfirm}
            title="Konfirmasi Penerimaan"
            description={`Apakah Anda yakin ingin menerima rekomendasi dari ${recommendation.contractorName}?`}
            additionalMessage="Tindakan ini akan mempengaruhi profil Anda dan tidak dapat dibatalkan."
          />
          
          <ConfirmationBox
            isOpen={isDeclineConfirmationOpen}
            onClose={() => setIsDeclineConfirmationOpen(false)}
            onConfirm={handleDeclineConfirm}
            title="Konfirmasi Penolakan"
            description={`Apakah Anda yakin ingin menolak rekomendasi dari ${recommendation.contractorName}?`}
            additionalMessage="Tindakan ini tidak dapat dibatalkan."
            confirmButtonText="Tolak"
            confirmButtonVariant="primary"
          />
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
