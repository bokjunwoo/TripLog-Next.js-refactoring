import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

export default function SearchRegionButton() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeButton, setActiveButton] = useState<number | null>(null);

  const handleButtonClick = (buttonId: number) => {
    setActiveButton(buttonId === activeButton ? null : buttonId);
    handlePageChange(buttonId);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = (buttonId: number) => {
    const selectedRegion = buttonData[buttonId - 1].name;
    const queryString = createQueryString('region', selectedRegion);
    router.push('?' + queryString);
  };

  const buttonData = [
    { id: 1, label: '서울', name: 'seoul' },
    { id: 2, label: '부산', name: 'busan' },
    { id: 3, label: '강릉', name: 'gangneung' },
    { id: 4, label: '경주', name: 'gyeongju' },
    { id: 5, label: '전주', name: 'jeonju' },
    { id: 6, label: '제주', name: 'jeju' },
  ];

  return (
    <>
      {buttonData.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonClick(button.id)}
          className={activeButton === button.id ? 'active' : ''}
        >
          {button.label}
        </button>
      ))}
    </>
  );
}