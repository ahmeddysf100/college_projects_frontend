import type { Arena, Arena_updated, participant } from "~/createArena";

export const useRank = (participants: any, rankings: any) => {
  console.log(participants);
  const tempParticipantsWithRankings: Record<string, any> = {}; // Specify type for tempParticipantsWithRankings
  // Iterate over each participant
  for (const participantId in participants) {
    if (participants.hasOwnProperty(participantId)) {
      const participant = participants[participantId];
      const participantName = participant.name;

      // Check if the participant's name exists in the rankings
      if (rankings.hasOwnProperty(participantName)) {
        // Add the participant to the temporary object with their ranking
        tempParticipantsWithRankings[participantId] = {
          ...participant,
          rank: rankings[participantName],
        };
      } else {
        // Handle the case where the participant's name doesn't exist in the rankings
        console.log(`No ranking found for participant ${participantName}`);
      }
    }
  }

  // Convert tempParticipantsWithRankings to an array of key-value pairs
  const sortedParticipantsArray = Object.entries(tempParticipantsWithRankings);

  // Sort the array based on the 'rank' property
  sortedParticipantsArray.sort(([, participantA], [, participantB]) => {
    return participantB.rank - participantA.rank; // Sort in descending order
  });

  // Convert the sorted array back to an object
  // const sortedParticipants: Record<string, any> = {};
  // sortedParticipantsArray.forEach(([participantId, participant]) => {
  //   sortedParticipants[participantId] = participant;
  // });

  return sortedParticipantsArray;
};
