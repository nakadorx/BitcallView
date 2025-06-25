const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ac libero ultrices aliquam. Donec in nunc nec nunc ultricies fermentum. Nullam nec purus ac libero ultrices aliquam. Donec in nunc nec nunc ultricies fermentum.'

export const dummyPostsData = [
  {
    id: 1,
    title: 'Polygon Price Prediction: Can POL Reach $1,000?',
    description: 'Is Polygon (POL) possible to hit $1,000? Break down key factors and growth prospects.',
    bannerImage: '/images/cards/8.jpg',
    commentCount: 5,
    date: 'January 24, 2025',
    mainImage: '/images/cards/8.jpg',
    images: ['/images/cards/8.jpg', '/images/cards/9.jpg', '/images/cards/10.jpg'],
    intro: 'Is Polygon (POL) possible to hit $1,000? Break down key factors and growth prospects.',
    sections: generateSections(lorem, 7),
    tags: ['Cryptocurrencies', 'Analysis', 'Price Prediction', 'Polygon', 'Technical Analysis'],
    relatedPosts: [
      {
        title: 'How to Stake Cryptocurrencies',
        image: '/images/cards/7.jpg',
        date: 'Jan 20, 2025',
        commentCount: 3,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ac libero ultrices'
      }
    ],
    comments: [{ id: 1, name: 'John Doe', content: 'Great post!' }]
  },
  {
    id: 2,
    title: 'How to Stake Cryptocurrencies Effectively',
    description: 'Learn the best strategies to maximize your staking rewards.',
    bannerImage: '/images/cards/10.jpg',
    commentCount: 3,
    date: 'January 20, 2025',
    mainImage: '/images/cards/10.jpg',
    images: ['/images/cards/8.jpg', '/images/cards/9.jpg', '/images/cards/10.jpg'],
    intro: 'Learn the best strategies to maximize your staking rewards.',
    sections: generateSections(lorem, 5),
    tags: ['Staking', 'Educational', 'Cryptocurrencies', 'Staking Rewards', 'Proof of Stake', 'Staking Pools'],
    relatedPosts: [
      {
        title: 'Polygon Price Prediction',
        image: '/images/cards/8.jpg',
        date: 'Jan 24, 2025',
        commentCount: 5,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus ac libero ultrices'
      }
    ],
    comments: [{ id: 1, name: 'Jane Doe', content: 'Very informative!' }]
  }
]

/**
 * Generates an array of sections with duplicated descriptions.
 * @param {string} baseDescription - The base description to duplicate.
 * @param {number} count - The number of sections to generate.
 * @returns {Array} An array of section objects.
 */
function generateSections(baseDescription: string, count: number) {
  const duplicatedDescription = duplicateText(baseDescription, 8)

  return Array.from({ length: count }, (_, i) => ({
    title: `Section ${i + 1}`,
    description: duplicatedDescription
  }))
}

/**
 * Duplicates a given text `n` times with a space in between.
 * @param {string} text - The text to duplicate.
 * @param {number} n - The number of times to duplicate the text.
 * @returns {string} The duplicated text.
 */
function duplicateText(text: string, n: number) {
  return Array(n).fill(text).join(' ')
}
