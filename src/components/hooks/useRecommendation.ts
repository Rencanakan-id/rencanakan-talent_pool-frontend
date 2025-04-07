// import { useState } from "react";

import { RecommendationResponseDTO, StatusType } from '../ui/recommendation';

export function useRecommendation() {
  const loremIpsum = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
  in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
  sunt in culpa qui officia deserunt mollit anim id est laborum.
  `;
  const recommendations: RecommendationResponseDTO[] = [
    {
      id: '1',
      talentId: '101',
      contractorId: 202,
      contractorName: 'John Doe',
      message: loremIpsum,
      status: StatusType.PENDING,
    },
    {
      id: '2',
      talentId: '102',
      contractorId: 203,
      contractorName: 'Jane Smith',
      message: 'Pekerjaan luar biasa, sangat detail dan komunikatif.',
      status: StatusType.APPROVED,
    },
  ];

  // const [recommendation, setRecommendation] = useState<RecommendationResponseDTO[] | null>(recommendations);
  // const [isLoading, setIsLoading] = useState(false);
  // const token  = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzODIxMTE1LCJleHAiOjE3NDM4MjQ3MTV9.BQjvCvUgpZH6o-IeoqgcJjbtzY9QK8KU2vkG6KAX0qo";

  // useEffect(() => {
  //   const fetchExperience = async () => {
  //     if (!token || !userId) return;
  //     try {
  //       const experienceData = await UserService.getUserExperience(userId, token);
  //       setExperience(experienceData.data || null);
  //     } catch (err) {
  //       console.error(err);
  //       setExperience(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchExperience();
  // }, [token, userId]);

  return { recommendations, isLoading: false };
}
