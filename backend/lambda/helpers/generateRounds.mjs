export const generateRounds = ({ maxCards }) => {
  const fullRounds = [
    "10d","9d","8d","7d","6d","5d","4d","3d","2d","1d",
    "2u","3u","4u","5u","6u","7u","8u","9u","10u"
  ];

  const startKey = `${maxCards}d`;
  const endKey = `${maxCards}u`;

  const startIndex = fullRounds.indexOf(startKey);
  const endIndex = fullRounds.indexOf(endKey);

  return fullRounds.slice(startIndex, endIndex + 1);
};
