import { Calendar, Boxes, Receipt, Postcard } from 'react-bootstrap-icons';
// NOTE: choose icon from the library: https://icons.getbootstrap.com/

export default {
  seed: 'https://seed.seedao.xyz/',
  resource: [
    { name: 'resources.calendar', link: 'https://tally.so/r/mKxkWD', id: 'calendar', icon: <Calendar /> },
    { name: 'resources.brand', link: 'https://tally.so/r/w4QxNd', id: 'brand', icon: <Postcard /> },
    { name: 'resources.community', link: 'https://tally.so/r/mBp09R', id: 'community', icon: <Receipt /> },
  ],
  applyAppLink: 'https://tally.so/r/3XozzP',
  governance: [
    {
      name: 'city-hall.communityReview',
      link: 'https://tally.so/forms/mBp09R/submissions',
      id: 'community',
      icon: <Receipt />,
    },
    {
      name: 'city-hall.CalendarReview',
      link: 'https://tally.so/r/mKxkWD/submissions',
      id: 'calendar',
      icon: <Calendar />,
    },
    {
      name: 'city-hall.AppReview',
      link: 'https://tally.so/forms/3XozzP/submissions',
      id: 'app',
      icon: <Boxes />,
    },
  ],
  brand: [
    {
      name: 'city-hall.brandReview',
      link: 'https://tally.so/forms/w4QxNd/submissions',
      id: 'brand',
      icon: <Postcard />,
    },
  ],
};
