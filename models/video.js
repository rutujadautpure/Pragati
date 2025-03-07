const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Finance',
      'Tax',
      'Fashion, Handicraft and Luggage',
      'Home Decor, Furniture and Hardware',
      'Electrical, Electronics and Software',
      'Books, Office Supplies and Madla',
      'Personal Care Health and Beauty',
      'Sports, Hobbies, Toys and Events',
      'Others and Services',
    ],
    required: true,
  },
});

const Video = mongoose.model('Video', videoSchema);

const videos = [
    // Finance
    {
      name: 'Investment Strategies for Beginners',
      url: 'https://www.youtube.com/embed/4TfflggY2P0',
      description: 'Learn the basics of investing, including stocks, bonds, and mutual funds.',
      category: 'Finance',
    },
    {
      name: 'How to Plan for Retirement',
      url: 'https://www.youtube.com/embed/BdLQIWpZjyE',
      description: 'This video will guide you through the process of planning for a comfortable retirement.',
      category: 'Finance',
    },
    {
      name: 'Stock Market 101',
      url: 'https://www.youtube.com/embed/p3kFt_StIRw',
      description: 'An introductory video to understanding the stock market and how it works.',
      category: 'Finance',
    },
    {
      name: 'Real Estate Investing Tips',
      url: 'https://www.youtube.com/embed/LaM8b7pKkxE',
      description: 'Discover the basics of real estate investing and how to get started.',
      category: 'Finance',
    },
    {
      name: 'Tax Planning for Small Business Owners',
      url: 'https://www.youtube.com/embed/q7z0VZzYoYY',
      description: 'Learn about effective tax strategies for small business owners.',
      category: 'Finance',
    },
  
    // Tax
    {
      name: 'Tax Filing for 2023',
      url: 'https://www.youtube.com/embed/GaHdtUzVX-E',
      description: 'Step-by-step guide on how to file your taxes for the year 2023.',
      category: 'Tax',
    },
    {
      name: 'Understanding Sales Tax',
      url: 'https://www.youtube.com/embed/A44JOkI_0A4',
      description: 'Learn the basics of sales tax and how it impacts your business.',
      category: 'Tax',
    },
    {
      name: 'Tax Deductions for Freelancers',
      url: 'https://www.youtube.com/embed/s1g3Rwv0qHU',
      description: 'This video provides insights into tax deductions that freelancers can use.',
      category: 'Tax',
    },
    {
      name: 'Tax Benefits of Homeownership',
      url: 'https://www.youtube.com/embed/zbb5udZ2ftM',
      description: 'Learn about the tax advantages of owning a home.',
      category: 'Tax',
    },
    {
      name: 'How to Avoid Tax Audits',
      url: 'https://www.youtube.com/embed/o5KL71EYg1w',
      description: 'Tips on how to minimize the risk of being audited by the IRS.',
      category: 'Tax',
    },
  
    // Fashion, Handicraft and Luggage
    {
      name: 'Top 10 Fashion Trends of 2023',
      url: 'https://www.youtube.com/embed/ruJdXpxoaM8',
      description: 'Explore the hottest fashion trends of the year.',
      category: 'Fashion, Handicraft and Luggage',
    },
    {
      name: 'How to Style Handcrafted Jewelry',
      url: 'https://www.youtube.com/embed/xpqUPj3Uq7A',
      description: 'Learn how to incorporate handcrafted jewelry into your outfits.',
      category: 'Fashion, Handicraft and Luggage',
    },
    {
      name: 'Packing Tips for Traveling Light',
      url: 'https://www.youtube.com/embed/dJjAyKNE1qI',
      description: 'Discover how to pack your luggage efficiently for any trip.',
      category: 'Fashion, Handicraft and Luggage',
    },
    {
      name: 'DIY Fashion Hacks',
      url: 'https://www.youtube.com/embed/ZY3dBrK0oZQ',
      description: 'Easy and fun DIY fashion hacks you can try at home.',
      category: 'Fashion, Handicraft and Luggage',
    },
    {
      name: 'The Art of Handicrafts',
      url: 'https://www.youtube.com/embed/tx_XAqoxT3o',
      description: 'Learn the basics of making beautiful handicrafts.',
      category: 'Fashion, Handicraft and Luggage',
    },
  
    // Home Decor, Furniture and Hardware
    {
      name: '2023 Home Decor Trends',
      url: 'https://www.youtube.com/embed/d7UHHWxXbIk',
      description: 'Get to know the home decor trends that are taking over in 2023.',
      category: 'Home Decor, Furniture and Hardware',
    },
    {
      name: 'How to Choose the Perfect Sofa',
      url: 'https://www.youtube.com/embed/YrX9aNEg5wM',
      description: 'Find the ideal sofa that fits your living room and style.',
      category: 'Home Decor, Furniture and Hardware',
    },
    {
      name: 'DIY Home Improvement Ideas',
      url: 'https://www.youtube.com/embed/N35ZK0tDS34',
      description: 'Simple home improvement projects that you can do yourself.',
      category: 'Home Decor, Furniture and Hardware',
    },
    {
      name: 'How to Organize Your Home Efficiently',
      url: 'https://www.youtube.com/embed/40vv5Fy3hOE',
      description: 'Learn organizational tips and tricks for your home.',
      category: 'Home Decor, Furniture and Hardware',
    },
    {
      name: 'Choosing the Right Lighting for Your Home',
      url: 'https://www.youtube.com/embed/cgMGhEdEwXI',
      description: 'A guide to selecting the perfect lighting to complement your decor.',
      category: 'Home Decor, Furniture and Hardware',
    },
  
    // Electrical, Electronics and Software
    {
      name: 'How to Build a Gaming PC',
      url: 'https://www.youtube.com/embed/LtE-j1vzzGQ',
      description: 'Learn the process of building a custom gaming PC.',
      category: 'Electrical, Electronics and Software',
    },
    {
      name: 'Understanding Electrical Wiring for Beginners',
      url: 'https://www.youtube.com/embed/Q3IKc2ApfW0',
      description: 'A beginner’s guide to understanding electrical wiring systems.',
      category: 'Electrical, Electronics and Software',
    },
    {
      name: 'Top 5 Programming Languages to Learn',
      url: 'https://www.youtube.com/embed/hHDz0w0Y2mg',
      description: 'Learn about the top programming languages for 2023 and beyond.',
      category: 'Electrical, Electronics and Software',
    },
    {
      name: 'How to Fix Common Electronics Issues',
      url: 'https://www.youtube.com/embed/h5j82z8dTeI',
      description: 'Solve common electronics problems with simple fixes.',
      category: 'Electrical, Electronics and Software',
    },
    {
      name: 'Introduction to Cybersecurity',
      url: 'https://www.youtube.com/embed/PtNFpDML2XA',
      description: 'Learn the basics of cybersecurity and how to stay safe online.',
      category: 'Electrical, Electronics and Software',
    },
  ];
  
  
  

const saveVideos = async () => {
  try {
    for (let i = 0; i < videos.length; i++) {
      await Video.create(videos[i]);
      console.log(`Video saved: ${videos[i].name}`);
    }
    console.log('All videos saved successfully!');
  } catch (err) {
    console.error('Error inserting video:', err);
  }
};

module.exports = { saveVideos, Video };
