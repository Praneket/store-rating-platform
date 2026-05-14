import { useState } from 'react';

const useSort = (defaultField = 'createdAt', defaultOrder = 'desc') => {
  const [sortBy, setSortBy] = useState(defaultField);
  const [sortOrder, setSortOrder] = useState(defaultOrder);

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return { sortBy, sortOrder, handleSort };
};

export default useSort;
