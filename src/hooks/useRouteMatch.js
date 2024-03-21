import {useLocation, matchPath} from 'react-router-dom'


export default function useRouteMatch(path){
  const location = useLocation();

  // based on match return true or false
  return matchPath(location.pathname, {path});
}