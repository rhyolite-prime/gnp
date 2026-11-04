/** Shape consumed by VideoCard. */
export interface LatestVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

/** Shared video list for the landing "Latest Videos" section and the "Watch More Videos" page. */
export const latestVideos: LatestVideo[] = [
  {
    id: 1,
    title: 'The Ghanaian Trumpeter at Buckingham Palace',
    description: 'Royal performance highlights Ghanaian musical talent...',
    thumbnail: 'https://ext.same-assets.com/111305068/2385636436.png'
  },
  {
    id: 2,
    title: 'Security chiefs pledge loyalty to President',
    description: 'Military and security leadership affirm commitment...',
    thumbnail: 'https://ext.same-assets.com/111305068/3057553277.png'
  },
  {
    id: 3,
    title: 'Court to rule on NDC\'s objection',
    description: 'Legal proceedings on mandamus application scheduled...',
    thumbnail: 'https://ext.same-assets.com/111305068/1051578448.jpeg'
  },
  {
    id: 4,
    title: 'Democracy and Electoral Process',
    description: 'Discussion on Ghana\'s democratic institutions...',
    thumbnail: 'https://ext.same-assets.com/111305068/895135478.jpeg'
  }
];
