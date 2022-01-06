import type { Message } from "discord.js";
import type DisTube from "distube";

export type Command = {
  name: string;
  cmds: string[];
  run: (distube: DisTube, message: Message, args: string[]) => void;
};

export type MMResponse = {
  message: {
    body: { track_list: { track: Track }[] };
  };
};
export type Track = {
  artist_name: string;
  track_name: string;
  track_share_url: string;
};

export type HFResponse = {
  label: string;
  score: number;
}[][];

export type WSResponse = {
  quote: {
    body: string;
  };
};
