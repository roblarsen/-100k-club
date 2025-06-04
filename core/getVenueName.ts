import { venues } from "./venues";

export const getVenueName = (venue) => {
  if (venue in venues) {
    return venues[venue];
  } else {
    return "Unknown Venue";
  }
};
