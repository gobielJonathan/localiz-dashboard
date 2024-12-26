import { FormError } from '@/model/form';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => {
      if ('error' in response) {
        if (response.error.fieldErrors)
          throw new FormError(response.error.fieldErrors);
        throw new Error(response.error);
      }
      return response;
    });

export default fetcher;
