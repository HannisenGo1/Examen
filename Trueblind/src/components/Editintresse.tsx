import { useState} from 'react';

interface EditInterestsProps {
  intresseLista: string[];

  initialInterests: string[];
}

export const EditInterests = ({
  intresseLista,
  initialInterests,
}: EditInterestsProps) => {
  const [updatedInterests, setUpdatedInterests] = useState<string[]>(initialInterests);

  const handleInterestClick = (interest: string) => {
    if (updatedInterests.includes(interest)) {
      setUpdatedInterests(updatedInterests.filter((item) => item !== interest));
    } else {
      if (updatedInterests.length < 5) {
        setUpdatedInterests([...updatedInterests, interest]);
      }
    }
  };



  return (
    <div className="interest-buttons">
      {intresseLista.map((interest) => (
        <button
          type="button"
          key={interest}
          className={`interest-button ${updatedInterests.includes(interest) ? 'selected' : ''}`}
          onClick={() => handleInterestClick(interest)}
          disabled={updatedInterests.length >= 5 && !updatedInterests.includes(interest)}
        >
          {interest}
        </button>
      ))}
    </div>
  );
};

export default EditInterests;
