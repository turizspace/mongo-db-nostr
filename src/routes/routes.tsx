import { RouteProps } from 'react-router-dom';
import Create from '../Components/Create';
import SigninNostr from '../Components/SigninNostr';
import ProfileCard from '../Components/ProfileCard';


export const generateRoutes = (): RouteProps[] => [
  {
    path: '/',
    element: <Create /> // Assuming Create is a React component
    // Add 'element' with the component directly instead of 'component' and 'exact' is not required here
  },
  {
    path: '/signin',
    element: <SigninNostr /> // Assuming SigninNostr is a React component
  },
  {
    path: '/profile',
    element: <ProfileCard /> // Assuming SigninNostr is a React component
  },



  // Add more routes as needed
];

export default generateRoutes;
