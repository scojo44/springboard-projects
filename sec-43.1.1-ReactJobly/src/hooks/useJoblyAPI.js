import {useEffect, useState} from 'react'

/** A hook to use the Jobly API 
 * apiCall: The method in JoblyAPI to be called
 * args: Any arguments to be passed to the API call
 */

export default function useJoblyAPI(apiCall, args) {
  const [data, setData] = useState([]);
  const [params, setParams] = useState(args);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const resp = await apiCall(params);
        setData(() => resp);
        setError('');
      }
      catch(e) {
        setError(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [params]);

  return {data, setParams, error, isLoading};
}
